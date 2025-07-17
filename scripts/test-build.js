const fs = require('fs');
const path = require('path');

function testBuildConfig() {
  console.log('🧪 测试构建配置...\n');
  
  let hasErrors = false;
  
  // 检查文件是否存在
  const requiredFiles = [
    'vite.config.ts',
    'vite.config.firefox.ts',
    'public/manifest.json',
    'public/manifest-firefox.json',
    'newtab.html',
    'src/newtab/main.ts',
    'src/newtab/App.vue'
  ];
  
  console.log('📁 检查必要文件...');
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - 文件不存在`);
      hasErrors = true;
    }
  });
  
  // 检查 package.json 脚本
  console.log('\n📋 检查 package.json 脚本...');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = [
    'build:chrome',
    'build:firefox',
    'build:all',
    'build:package'
  ];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`❌ ${script} - 脚本不存在`);
      hasErrors = true;
    }
  });
  
  // 检查依赖
  console.log('\n📦 检查依赖...');
  const requiredDeps = ['archiver'];
  requiredDeps.forEach(dep => {
    if (packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - 依赖不存在`);
      hasErrors = true;
    }
  });
  
  // 检查 manifest 文件内容
  console.log('\n📄 检查 manifest 文件...');
  try {
    const chromeManifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
    const firefoxManifest = JSON.parse(fs.readFileSync('public/manifest-firefox.json', 'utf8'));
    
    console.log(`✅ Chrome manifest (v${chromeManifest.manifest_version}): ${chromeManifest.name}`);
    console.log(`✅ Firefox manifest (v${firefoxManifest.manifest_version}): ${firefoxManifest.name}`);
    
    if (chromeManifest.manifest_version !== 3) {
      console.log('⚠️  Chrome manifest 应该使用 version 3');
    }
    
    if (firefoxManifest.manifest_version !== 2) {
      console.log('⚠️  Firefox manifest 应该使用 version 2');
    }
    
  } catch (error) {
    console.log(`❌ 解析 manifest 文件失败: ${error.message}`);
    hasErrors = true;
  }
  
  // 总结
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ 配置检查失败，请修复上述问题后重试');
    process.exit(1);
  } else {
    console.log('✅ 配置检查通过，可以开始构建！');
    console.log('\n📝 可用的构建命令:');
    console.log('  npm run build:chrome     - 构建 Chrome 版本');
    console.log('  npm run build:firefox    - 构建 Firefox 版本');
    console.log('  npm run build:all        - 构建所有版本');
    console.log('  npm run build:package    - 构建并打包所有版本');
  }
}

testBuildConfig(); 