const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 用户查询课程成绩 - 公开接口
router.post('/search', async (req, res) => {
  try {
    const { query, academic_year, semester } = req.body;
    
    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];
    
    if (query && query.trim()) {
      const searchQuery = `%${query.trim()}%`;
      whereConditions.push(`(course_name LIKE ? OR course_code LIKE ? OR class_code LIKE ? OR college LIKE ?)`);
      queryParams.push(searchQuery, searchQuery, searchQuery, searchQuery);
    }
    
    if (academic_year) {
      whereConditions.push('academic_year = ?');
      queryParams.push(academic_year);
    }
    
    if (semester) {
      whereConditions.push('semester = ?');
      queryParams.push(semester);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // 查询课程成绩，支持模糊搜索和筛选
    const [results] = await pool.execute(`
      SELECT * FROM course_grades 
      ${whereClause}
      ORDER BY academic_year DESC, semester DESC, course_name ASC
    `, queryParams);

    if (results.length === 0) {
      return res.json({
        success: true,
        message: '未找到相关课程信息',
        data: {
          exists: false,
          results: []
        }
      });
    }

    // 合并相同课程的不同成绩分项
    const mergedResults = mergeCourseGrades(results);

    res.json({
      success: true,
      message: '查询成功',
      data: {
        exists: true,
        results: mergedResults
      }
    });

  } catch (error) {
    console.error('查询课程成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 合并相同课程的不同成绩分项
function mergeCourseGrades(courses) {
  const courseMap = new Map();
  
  courses.forEach(course => {
    // 创建唯一键：课程名称 + 学年 + 学期 + 开课学院 + 课程代码 + 教学班
    const key = `${course.course_name}-${course.academic_year}-${course.semester}-${course.college}-${course.course_code}-${course.class_code}`;
    
    if (!courseMap.has(key)) {
      // 创建新的合并课程对象
      courseMap.set(key, {
        ...course,
        grade_items: [{
          grade_item: course.grade_item,
          score: course.score
        }]
      });
    } else {
      // 添加到现有课程的成绩分项中
      const existingCourse = courseMap.get(key);
      existingCourse.grade_items.push({
        grade_item: course.grade_item,
        score: course.score
      });
    }
  });
  
  // 对每个课程的成绩分项进行排序
  const sortedResults = Array.from(courseMap.values()).map(course => {
    // 按优先级排序：平时 -> 期中 -> 实验 -> 期末 -> 总评
    const priorityOrder = {
      '平时': 1,
      '期中': 2,
      '实验': 3,
      '期末': 4,
      '总评': 5
    };
    
    course.grade_items.sort((a, b) => {
      const aPriority = getPriority(a.grade_item, priorityOrder);
      const bPriority = getPriority(b.grade_item, priorityOrder);
      return aPriority - bPriority;
    });
    
    return course;
  });
  
  return sortedResults;
}

// 获取成绩分项的优先级
function getPriority(gradeItem, priorityOrder) {
  for (const [key, priority] of Object.entries(priorityOrder)) {
    if (gradeItem.includes(key)) {
      return priority;
    }
  }
  return 999; // 未知分项排在最后
}

// 获取所有课程成绩 - 管理员接口
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [results] = await pool.execute(`
      SELECT * FROM course_grades 
      ORDER BY academic_year DESC, semester DESC, course_name ASC
    `);

    // 合并相同课程的不同成绩分项
    const mergedResults = mergeCourseGrades(results);

    res.json({
      success: true,
      message: '获取成功',
      data: mergedResults
    });

  } catch (error) {
    console.error('获取所有课程成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 添加课程成绩 - 管理员接口
router.post('/add', [
  authenticateToken,
  requireAdmin,
  body('course_name').notEmpty().withMessage('课程名称不能为空'),
  body('academic_year').notEmpty().withMessage('学年不能为空'),
  body('semester').isInt({ min: 1, max: 2 }).withMessage('学期必须是1或2'),
  body('college').notEmpty().withMessage('开课学院不能为空'),
  body('course_code').notEmpty().withMessage('课程代码不能为空'),
  body('class_code').notEmpty().withMessage('教学班不能为空'),
  body('credit').isFloat({ min: 0 }).withMessage('学分必须是正数'),
  body('score').notEmpty().withMessage('成绩不能为空'),
  body('grade_item').notEmpty().withMessage('成绩分项不能为空')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const {
      course_name,
      academic_year,
      semester,
      college,
      course_code,
      class_code,
      credit,
      score,
      grade_item
    } = req.body;

    // 插入新课程成绩
    const [result] = await pool.execute(`
      INSERT INTO course_grades 
      (course_name, academic_year, semester, college, course_code, class_code, credit, score, grade_item)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [course_name, academic_year, semester, college, course_code, class_code, credit, score, grade_item]);

    res.json({
      success: true,
      message: '添加成功',
      data: {
        id: result.insertId,
        course_name,
        academic_year,
        semester,
        college,
        course_code,
        class_code,
        credit,
        score,
        grade_item
      }
    });

  } catch (error) {
    console.error('添加课程成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 修改课程成绩 - 管理员接口
router.put('/update/:id', [
  authenticateToken,
  requireAdmin,
  body('course_name').notEmpty().withMessage('课程名称不能为空'),
  body('academic_year').notEmpty().withMessage('学年不能为空'),
  body('semester').isInt({ min: 1, max: 2 }).withMessage('学期必须是1或2'),
  body('college').notEmpty().withMessage('开课学院不能为空'),
  body('course_code').notEmpty().withMessage('课程代码不能为空'),
  body('class_code').notEmpty().withMessage('教学班不能为空'),
  body('credit').isFloat({ min: 0 }).withMessage('学分必须是正数'),
  body('score').notEmpty().withMessage('成绩不能为空'),
  body('grade_item').notEmpty().withMessage('成绩分项不能为空')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      course_name,
      academic_year,
      semester,
      college,
      course_code,
      class_code,
      credit,
      score,
      grade_item
    } = req.body;

    // 检查记录是否存在
    const [existing] = await pool.execute(
      'SELECT * FROM course_grades WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: '课程记录不存在'
      });
    }

    // 更新课程成绩
    await pool.execute(`
      UPDATE course_grades 
      SET course_name = ?, academic_year = ?, semester = ?, college = ?, 
          course_code = ?, class_code = ?, credit = ?, score = ?, grade_item = ?
      WHERE id = ?
    `, [course_name, academic_year, semester, college, course_code, class_code, credit, score, grade_item, id]);

    res.json({
      success: true,
      message: '更新成功',
      data: {
        id: parseInt(id),
        course_name,
        academic_year,
        semester,
        college,
        course_code,
        class_code,
        credit,
        score,
        grade_item
      }
    });

  } catch (error) {
    console.error('更新课程成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除课程成绩 - 管理员接口
router.delete('/delete/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查记录是否存在
    const [existing] = await pool.execute(
      'SELECT * FROM course_grades WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: '课程记录不存在'
      });
    }

    // 删除课程成绩
    await pool.execute('DELETE FROM course_grades WHERE id = ?', [id]);

    res.json({
      success: true,
      message: '删除成功',
      data: { id: parseInt(id) }
    });

  } catch (error) {
    console.error('删除课程成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 根据ID获取单个课程成绩 - 管理员接口
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await pool.execute(
      'SELECT * FROM course_grades WHERE id = ?',
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: '课程记录不存在'
      });
    }

    res.json({
      success: true,
      message: '获取成功',
      data: results[0]
    });

  } catch (error) {
    console.error('获取单个课程成绩错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;
