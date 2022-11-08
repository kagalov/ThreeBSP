/**
 * 渲染器
 */
var glRender;
/**
 * 初始化渲染器
 */
function initRender() {
    glRender = new THREE.WebGLRenderer({
        // 抗锯齿
        antialias: true
    });
    glRender.setSize(window.innerWidth, window.innerHeight);
    //添加到页面
    document.body.appendChild(glRender.domElement);
}
/**
 * 相机
 */
var camera;

function initCamera() {
    //创建透视相机
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    // 局部位置
    camera.position.set(0, 200, 500);
}
/**
 * 场景
 */
var scene;

function initScene() {
    scene = new THREE.Scene();
}
/**
 * 光源
 */
var light;

function initLight() {
    // 添加环境光
    scene.add(new THREE.AmbientLight(0x404040));
    // 用平行光模拟太阳光
    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 1, 1);
    // 添加到场景中
    scene.add(light);
}
/**
 * 创建模型
 */
function createModel() {
    // 创建一个三维坐标系辅助轴
    let axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    //创建立方体
    let cubeGeometry = new THREE.BoxGeometry(60, 60, 60);
    let cube = createMesh(cubeGeometry);

    let cylinderGeometry = new THREE.CylinderGeometry(5, 5, 10, 32);
    let cylinder = createMesh(cylinderGeometry);
    // 十进制
    cylinder.position.x = -30;
    // 旋转是弧度制, 绕Z轴旋转 PI / 2
    cylinder.rotation.z = Math.PI / 2;

    let resultMesh = subtract(cube, cylinder);
    //为结果添加phong材质
    let material = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.6,
        color: 0x00ffff
    });
    resultMesh.material = material;

    // 将模型加入场景中
    scene.add(cube);
    scene.add(cylinder);
    scene.add(resultMesh);
}

function subtract(originMesh, subMesh) {
    let originBsp = new ThreeBSP(originMesh);
    let subBsp = new ThreeBSP(subMesh);
    let resultBsp = originBsp.subtract(subBsp);
    let resultMesh = resultBsp.toMesh();
    //更新模型的面和顶点的数据
    resultMesh.geometry.computeFaceNormals();
    resultMesh.geometry.computeVertexNormals();
    return resultMesh;
}
/**
 * 创建网格体
 * @param {*} geometry 
 */
function createMesh(geometry) {

    // 基础网格材质
    let basicMat = new THREE.MeshBasicMaterial({
        // 透明度
        transparent: true,
        opacity: 0.6,
        wireframe: true,
        wireframeLinewidth: 0.5
    });

    return new THREE.Mesh(geometry, basicMat);

}
/**
 * 渲染
 */
function render() {
    glRender.render(scene, camera);
}
/**
 * 初始化性能插件
 */
var stats;

function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

/**
 * 用户交互插件
 */
var controls;

function initControls() {
    // 初始化
    controls = new THREE.OrbitControls(camera, glRender.domElement);
    // 是否启用惯性
    controls.enableDamping = true;
    // 是否启动相机缩放
    controls.enableZoom = true;
    // 是否自动选装
    controls.autoRotate = false;
    // 设置相机离远点的最近的距离
    controls.minDistance = 20;
    // 设置相机里原点最远的距离
    controls.maxDistance = 5000;
    // 启用或禁用摄像机平移
    controls.enablePan = true;
}

/** 
 * 生辰GUI配置项
 */

// 保存到gui的参数
var gui = {};

// datGUI的保留界面
var datGui;

function initGui() {
    datGui = new dat.GUI();
}

/**
 * 播放动画
 */
function animate() {
    //更新控制器
    controls.update();
    // 渲染
    render();

    //更新性能数据
    stats.update();
    //更新一帧
    requestAnimationFrame(animate);
}
//窗口大小变动的函数触发
function onWindowResize() {
    //修改透视相机的参数
    //摄像机视锥体长宽比
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //重新渲染
    render();
    glRender.setSize(window.innerWidth, window.innerHeight);
}
/**
 * 开始绘制
 */
function draw() {
    // 初始化三维场景
    initRender();
    initScene();
    initCamera();
    initLight();

    // 创建模型
    createModel();

    // 初始化控制面板
    initControls();
    initStats();
    initGui();

    //执行动画
    animate();

    window.onresize = onWindowResize;
}