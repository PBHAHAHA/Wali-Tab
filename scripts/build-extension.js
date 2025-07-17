const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createZip(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      log(`✓ 已创建 ${outputPath} (${archive.pointer()} bytes)`, 'green');
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function buildExtension() {
  log('🚀 开始构建浏览器扩展...', 'cyan');
  
  try {
    // 清理旧的构建文件
    log('\n📁 清理旧的构建文件...', 'yellow');
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    if (fs.existsSync('dist-firefox')) {
      fs.rmSync('dist-firefox', { recursive: true, force: true });
    }
    if (fs.existsSync('packages')) {
      fs.rmSync('packages', { recursive: true, force: true });
    }
    log('✓ 清理完成', 'green');

    // 构建 Chrome 版本
    log('\n🔧 构建 Chrome 版本...', 'yellow');
    execSync('npm run build:chrome', { stdio: 'inherit' });
    log('✓ Chrome 版本构建完成', 'green');

    // 构建 Firefox 版本
    log('\n🔧 构建 Firefox 版本...', 'yellow');
    execSync('npm run build:firefox', { stdio: 'inherit' });
    log('✓ Firefox 版本构建完成', 'green');

    // 创建打包目录
    log('\n📦 创建打包文件...', 'yellow');
    if (!fs.existsSync('packages')) {
      fs.mkdirSync('packages');
    }

    // 读取版本信息
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const version = packageJson.version;

    // 打包 Chrome 版本
    await createZip('dist', `packages/wali-tab-chrome-v${version}.zip`);
    
    // 打包 Firefox 版本
    await createZip('dist-firefox', `packages/wali-tab-firefox-v${version}.zip`);

    // 显示构建结果
    log('\n🎉 构建完成!', 'green');
    log('\n📊 构建结果:', 'bright');
    log(`├── Chrome 版本: dist/`, 'blue');
    log(`├── Firefox 版本: dist-firefox/`, 'blue');
    log(`├── Chrome 打包: packages/wali-tab-chrome-v${version}.zip`, 'magenta');
    log(`└── Firefox 打包: packages/wali-tab-firefox-v${version}.zip`, 'magenta');
    
    log('\n📝 安装说明:', 'bright');
    log('Chrome:', 'yellow');
    log('  1. 打开 chrome://extensions/', 'blue');
    log('  2. 开启开发者模式', 'blue');
    log('  3. 点击"加载已解压的扩展程序"', 'blue');
    log('  4. 选择 dist/ 文件夹', 'blue');
    
    log('\nFirefox:', 'yellow');
    log('  1. 打开 about:debugging', 'blue');
    log('  2. 点击"此 Firefox"', 'blue');
    log('  3. 点击"临时加载附加组件"', 'blue');
    log('  4. 选择 dist-firefox/manifest.json 文件', 'blue');

  } catch (error) {
    log(`\n❌ 构建失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 检查是否安装了 archiver
try {
  require('archiver');
} catch (error) {
  log('❌ 缺少依赖 archiver，正在安装...', 'red');
  try {
    execSync('npm install archiver --save-dev', { stdio: 'inherit' });
    log('✓ archiver 安装完成', 'green');
  } catch (installError) {
    log('❌ 安装 archiver 失败，请手动安装: npm install archiver --save-dev', 'red');
    process.exit(1);
  }
}

buildExtension(); 