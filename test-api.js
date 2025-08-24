const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let adminToken = '';

// 测试管理员登录
async function testAdminLogin() {
  try {
    console.log('测试管理员登录...');
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD is not set in environment. Aborting test.');
      process.exit(1);
    }

    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: adminPassword
    });
    
    if (response.data.success) {
      adminToken = response.data.data.token;
      console.log('✅ 管理员登录成功');
      console.log('Token:', adminToken.substring(0, 20) + '...');
    } else {
      console.log('❌ 管理员登录失败:', response.data.message);
    }
  } catch (error) {
    console.log('❌ 管理员登录错误:', error.response?.data?.message || error.message);
  }
}

// 测试添加课程成绩
async function testAddCourse() {
  try {
    console.log('\n测试添加课程成绩...');
    const courseData = {
      course_name: '测试课程',
      academic_year: '2024-2025',
      semester: 1,
      college: '测试学院',
      course_code: 'TEST001',
      class_code: 'TEST001-01',
      credit: 2.0,
      score: '85',
      grade_item: '期末考试'
    };
    
    const response = await axios.post(`${BASE_URL}/courses/add`, courseData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ 添加课程成功, ID:', response.data.data.id);
      return response.data.data.id;
    } else {
      console.log('❌ 添加课程失败:', response.data.message);
    }
  } catch (error) {
    console.log('❌ 添加课程错误:', error.response?.data?.message || error.message);
  }
}

// 测试查询课程成绩
async function testSearchCourse() {
  try {
    console.log('\n测试查询课程成绩...');
    const response = await axios.post(`${BASE_URL}/courses/search`, {
      query: '测试课程'
    });
    
    if (response.data.success) {
      console.log('✅ 查询课程成功');
      console.log('查询结果数量:', response.data.data.results.length);
      if (response.data.data.results.length > 0) {
        console.log('第一条记录:', response.data.data.results[0].course_name);
      }
    } else {
      console.log('❌ 查询课程失败:', response.data.message);
    }
  } catch (error) {
    console.log('❌ 查询课程错误:', error.response?.data?.message || error.message);
  }
}

// 测试获取所有课程
async function testGetAllCourses() {
  try {
    console.log('\n测试获取所有课程...');
    const response = await axios.get(`${BASE_URL}/courses/all`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ 获取所有课程成功');
      console.log('课程总数:', response.data.data.length);
    } else {
      console.log('❌ 获取所有课程失败:', response.data.message);
    }
  } catch (error) {
    console.log('❌ 获取所有课程错误:', error.response?.data?.message || error.message);
  }
}

// 测试修改课程成绩
async function testUpdateCourse(courseId) {
  try {
    console.log('\n测试修改课程成绩...');
    const updateData = {
      course_name: '修改后的测试课程',
      academic_year: '2024-2025',
      semester: 2,
      college: '修改后的测试学院',
      course_code: 'TEST001',
      class_code: 'TEST001-01',
      credit: 3.0,
      score: '90',
      grade_item: '期末考试'
    };
    
    const response = await axios.put(`${BASE_URL}/courses/update/${courseId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ 修改课程成功');
    } else {
      console.log('❌ 修改课程失败:', response.data.message);
    }
  } catch (error) {
    console.log('❌ 修改课程错误:', error.response?.data?.message || error.message);
  }
}

// 测试删除课程成绩
async function testDeleteCourse(courseId) {
  try {
    console.log('\n测试删除课程成绩...');
    const response = await axios.delete(`${BASE_URL}/courses/delete/${courseId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ 删除课程成功');
    } else {
      console.log('❌ 删除课程失败:', response.data.message);
    }
  } catch (error) {
    console.log('❌ 删除课程错误:', error.response?.data?.message || error.message);
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始API测试...\n');
  
  await testAdminLogin();
  
  if (adminToken) {
    const courseId = await testAddCourse();
    await testSearchCourse();
    await testGetAllCourses();
    
    if (courseId) {
      await testUpdateCourse(courseId);
      await testDeleteCourse(courseId);
    }
  }
  
  console.log('\n✨ API测试完成!');
}

// 运行测试
runTests().catch(console.error);
