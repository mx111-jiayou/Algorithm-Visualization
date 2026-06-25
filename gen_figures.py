# -*- coding: utf-8 -*-
"""
为《算法可视化 - 需求分析文档》生成 4 类图（用例图 / 活动图 / 数据流图 / E-R 图），
输出到 D:/课设/算法可视化/figures/ 下，供 docx 嵌入使用。
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Ellipse, Polygon, Rectangle, FancyArrowPatch, Circle
from matplotlib.lines import Line2D

# 中文字体
plt.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'SimSun']
plt.rcParams['axes.unicode_minus'] = False

OUT_DIR = r"D:/课设/算法可视化/figures"
os.makedirs(OUT_DIR, exist_ok=True)


def style_axes(ax):
    ax.set_xticks([])
    ax.set_yticks([])
    for s in ax.spines.values():
        s.set_visible(False)


# ============== 1. 用例图 ==============
def draw_use_case_diagram():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=160)
    style_axes(ax)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)

    # 系统边界
    sys_rect = FancyBboxPatch((3.2, 0.5), 7.6, 9, boxstyle="round,pad=0.05",
                              fc="#F8F9FB", ec="#444", lw=1.5)
    ax.add_patch(sys_rect)
    ax.text(7.0, 9.2, "算法可视化  系统", ha="center", va="center",
            fontsize=12, fontweight="bold")

    # 演员（学生 / 教师 / 自学者）
    def actor(x, y, name):
        ax.add_patch(Circle((x, y + 0.35), 0.18, fc="white", ec="#333", lw=1.3))
        ax.plot([x, x], [y + 0.17, y - 0.35], color="#333", lw=1.3)
        ax.plot([x - 0.25, x + 0.25], [y - 0.05, y - 0.05], color="#333", lw=1.3)
        ax.plot([x, x - 0.2], [y - 0.35, y - 0.7], color="#333", lw=1.3)
        ax.plot([x, x + 0.2], [y - 0.35, y - 0.7], color="#333", lw=1.3)
        ax.text(x, y - 1.0, name, ha="center", fontsize=10)

    actor(1.5, 7.5, "学生 STU")
    actor(1.5, 4.5, "教师 TCH")
    actor(12.5, 6.0, "自学者 DEV")

    # 用例（椭圆）
    use_cases = [
        (5.0, 8.4, "浏览算法目录"),
        (8.5, 8.4, "选择算法"),
        (5.0, 7.2, "输入测试数据"),
        (8.5, 7.2, "随机生成数据"),
        (5.0, 6.0, "保存自定义用例"),
        (8.5, 6.0, "播放/单步/暂停"),
        (5.0, 4.8, "查看代码与步骤"),
        (8.5, 4.8, "切换主题"),
        (5.0, 3.6, "导出执行日志"),
        (8.5, 3.6, "算法对比"),
        (5.0, 2.4, "查看复杂度"),
        (8.5, 2.4, "查看关于信息"),
        (7.0, 1.2, "首次启动引导（include）"),
    ]
    uc_pos = {}
    for x, y, name in use_cases:
        e = Ellipse((x, y), 2.6, 0.7, fc="#E8F1FB", ec="#3A78C2", lw=1.1)
        ax.add_patch(e)
        ax.text(x, y, name, ha="center", va="center", fontsize=9)
        uc_pos[name] = (x, y)

    # 学生 → 多用例
    student_uses = ["浏览算法目录", "选择算法", "输入测试数据", "随机生成数据",
                    "保存自定义用例", "播放/单步/暂停", "查看代码与步骤",
                    "导出执行日志", "查看复杂度"]
    for n in student_uses:
        x, y = uc_pos[n]
        ax.plot([1.7, x - 1.3], [7.3, y], color="#666", lw=0.8)

    teacher_uses = ["选择算法", "保存自定义用例", "播放/单步/暂停",
                    "算法对比", "切换主题", "导出执行日志"]
    for n in teacher_uses:
        x, y = uc_pos[n]
        ax.plot([1.7, x - 1.3], [4.3, y], color="#666", lw=0.8)

    self_uses = ["浏览算法目录", "选择算法", "播放/单步/暂停",
                 "算法对比", "查看关于信息", "导出执行日志"]
    for n in self_uses:
        x, y = uc_pos[n]
        ax.plot([12.3, x + 1.3], [5.8, y], color="#666", lw=0.8)

    # include 关系
    sx, sy = uc_pos["选择算法"]
    fx, fy = uc_pos["首次启动引导（include）"]
    ax.annotate("", xy=(fx, fy + 0.35), xytext=(sx, sy - 0.35),
                arrowprops=dict(arrowstyle="->", linestyle="dashed", color="#888"))
    ax.text((sx + fx) / 2 + 0.2, (sy + fy) / 2, "<<include>>",
            color="#666", fontsize=8, style="italic")

    plt.title("图 4-1  系统用例图", fontsize=13, pad=10)
    plt.tight_layout()
    out = os.path.join(OUT_DIR, "fig_usecase.png")
    plt.savefig(out, bbox_inches="tight")
    plt.close()
    return out


# ============== 2. 活动图：算法播放主流程 ==============
def draw_activity_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 11), dpi=160)
    style_axes(ax)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)

    def node_box(x, y, w, h, text, fc="#E8F1FB", ec="#3A78C2"):
        b = FancyBboxPatch((x - w / 2, y - h / 2), w, h,
                           boxstyle="round,pad=0.04", fc=fc, ec=ec, lw=1.2)
        ax.add_patch(b)
        ax.text(x, y, text, ha="center", va="center", fontsize=10)

    def diamond(x, y, w, h, text):
        pts = [(x, y + h / 2), (x + w / 2, y), (x, y - h / 2), (x - w / 2, y)]
        ax.add_patch(Polygon(pts, fc="#FFF4D9", ec="#C58A1A", lw=1.2))
        ax.text(x, y, text, ha="center", va="center", fontsize=9)

    def arrow(x1, y1, x2, y2, label=None):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#444", lw=1.0))
        if label:
            ax.text((x1 + x2) / 2 + 0.1, (y1 + y2) / 2, label,
                    fontsize=8, color="#444")

    # 起点
    ax.add_patch(Circle((5, 13.4), 0.15, fc="black"))
    arrow(5, 13.25, 5, 12.85)
    node_box(5, 12.55, 3.4, 0.6, "用户启动应用")
    arrow(5, 12.25, 5, 11.85)
    node_box(5, 11.55, 3.6, 0.6, "选择算法（侧边栏）")
    arrow(5, 11.25, 5, 10.85)
    node_box(5, 10.55, 3.6, 0.6, "加载默认/历史输入")
    arrow(5, 10.25, 5, 9.85)
    diamond(5, 9.45, 3.4, 1.0, "是否使用随机数据?")
    arrow(3.3, 9.45, 1.8, 9.45, label="否")
    node_box(1.4, 9.45, 2.2, 0.6, "手动输入数据")
    arrow(6.7, 9.45, 8.2, 9.45, label="是")
    node_box(8.5, 9.45, 2.2, 0.6, "随机生成数据")

    arrow(1.4, 9.15, 1.4, 8.45)
    arrow(8.5, 9.15, 8.5, 8.45)
    node_box(1.4, 8.15, 2.2, 0.6, "格式校验")
    node_box(8.5, 8.15, 2.2, 0.6, "种子记录")
    arrow(1.4, 7.85, 1.4, 7.45)
    arrow(8.5, 7.85, 8.5, 7.45)
    diamond(1.4, 7.05, 2.4, 1.0, "校验通过?")
    arrow(0.2, 7.05, 0.0, 5.5)
    ax.text(0.05, 6.3, "否：弹出错误提示", fontsize=8, color="#a00")
    # merge
    arrow(2.6, 7.05, 4.0, 6.55, label="是")
    arrow(8.5, 7.85, 6.0, 6.55)
    node_box(5, 6.25, 3.6, 0.6, "构建算法步骤序列")
    arrow(5, 5.95, 5, 5.55)
    node_box(5, 5.25, 3.8, 0.6, "渲染初始画布与代码面板")
    arrow(5, 4.95, 5, 4.55)
    diamond(5, 4.15, 3.6, 1.1, "用户操作类型?")
    # 三分支
    arrow(3.2, 4.15, 1.4, 3.4, label="单步")
    arrow(5, 3.6, 5, 3.05, label="自动播放")
    arrow(6.8, 4.15, 8.6, 3.4, label="暂停/重置")
    node_box(1.4, 3.05, 2.2, 0.6, "推进 1 帧")
    node_box(5, 2.7, 3.4, 0.6, "按速度连续推进")
    node_box(8.6, 3.05, 2.2, 0.6, "切换状态机")

    arrow(1.4, 2.75, 1.4, 2.15)
    arrow(5, 2.4, 5, 2.05)
    arrow(8.6, 2.75, 8.6, 2.15)
    node_box(5, 1.8, 4.0, 0.6, "更新画布 / 步骤列表 / 高亮代码行")
    arrow(1.4, 1.85, 4.0, 1.85)
    arrow(8.6, 1.85, 6.0, 1.85)
    arrow(5, 1.5, 5, 1.05)
    diamond(5, 0.7, 3.4, 1.0, "已到末步?")
    arrow(3.3, 0.7, 1.0, 0.7, label="否")
    arrow(1.0, 0.7, 1.0, 4.45)
    arrow(1.0, 4.45, 3.2, 4.15)
    arrow(6.7, 0.7, 7.5, 0.7, label="是")
    node_box(8.5, 0.7, 1.8, 0.6, "完成态")

    # 终点
    ax.add_patch(Circle((9.6, 0.7), 0.18, fc="white", ec="black", lw=1.5))
    ax.add_patch(Circle((9.6, 0.7), 0.10, fc="black"))

    plt.title("图 4-2  算法播放主流程活动图", fontsize=13, pad=10)
    plt.tight_layout()
    out = os.path.join(OUT_DIR, "fig_activity.png")
    plt.savefig(out, bbox_inches="tight")
    plt.close()
    return out


# ============== 3. 数据流图（DFD 0/1 层） ==============
def draw_dfd_diagram():
    fig, ax = plt.subplots(figsize=(11, 8), dpi=160)
    style_axes(ax)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)

    def ext_entity(x, y, w, h, text):
        ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h,
                               fc="#FFEFD5", ec="#B8860B", lw=1.3))
        ax.text(x, y, text, ha="center", va="center", fontsize=10, fontweight="bold")

    def process(x, y, r, text, num=""):
        ax.add_patch(Circle((x, y), r, fc="#E0F2E9", ec="#2E7D5C", lw=1.3))
        if num:
            ax.text(x, y + 0.15, num, ha="center", fontsize=10, fontweight="bold")
            ax.text(x, y - 0.18, text, ha="center", fontsize=9)
        else:
            ax.text(x, y, text, ha="center", va="center", fontsize=10)

    def store(x, y, w, text, code=""):
        ax.plot([x - w / 2, x + w / 2], [y + 0.25, y + 0.25], color="#444", lw=1.2)
        ax.plot([x - w / 2, x + w / 2], [y - 0.25, y - 0.25], color="#444", lw=1.2)
        if code:
            ax.text(x - w / 2 + 0.2, y, code, ha="left", va="center",
                    fontsize=10, fontweight="bold", color="#555")
            ax.text(x + 0.2, y, text, ha="left", va="center", fontsize=9)
        else:
            ax.text(x, y, text, ha="center", va="center", fontsize=9)

    def flow(x1, y1, x2, y2, label="", offset=(0, 0.15)):
        ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color="#333", lw=1.0))
        if label:
            ax.text((x1 + x2) / 2 + offset[0], (y1 + y2) / 2 + offset[1],
                    label, fontsize=8, color="#333", ha="center")

    # 外部实体
    ext_entity(1.3, 7.5, 1.8, 0.9, "用户")
    ext_entity(1.3, 3.5, 1.8, 0.9, "本地文件\n系统")
    ext_entity(12.7, 7.5, 1.8, 0.9, "桌面屏幕")
    ext_entity(12.7, 3.5, 1.8, 0.9, "导出文件")

    # 处理
    process(5.0, 8.0, 0.9, "数据输入与校验", "1")
    process(7.5, 6.5, 0.9, "算法执行与追踪", "2")
    process(10.0, 8.0, 0.9, "渲染与同步", "3")
    process(5.0, 4.5, 0.9, "用例与日志管理", "4")
    process(10.0, 4.5, 0.9, "导出引擎", "5")

    # 数据存储
    store(7.5, 2.2, 4.5, "用例库 (TestCase)", code="D1")
    store(7.5, 1.0, 4.5, "执行日志 (ExecutionLog)", code="D2")

    # 流
    flow(2.2, 7.7, 4.1, 8.0, "原始输入")
    flow(5.9, 8.0, 6.6, 6.8, "合法数据")
    flow(8.4, 6.5, 9.1, 7.8, "步骤事件流")
    flow(10.9, 8.0, 11.8, 7.6, "动画帧/UI 更新")
    flow(11.8, 7.4, 10.9, 7.9)  # 反向无,删除
    # 删掉那条反向流（matplotlib 不会真正删除，重画相同方向覆盖即可）
    flow(2.2, 7.3, 4.1, 7.8, "选择 & 控制")

    flow(5.0, 7.1, 5.0, 5.4, "保存动作")
    flow(5.9, 4.5, 6.5, 2.4, "新增/更新", offset=(0.3, 0))
    flow(6.5, 1.8, 5.9, 4.3, "载入用例", offset=(-0.5, 0))

    flow(8.4, 6.2, 9.6, 4.9, "步骤序列")
    flow(9.1, 4.5, 6.5, 1.4, "写日志", offset=(0, -0.2))
    flow(10.9, 4.5, 11.8, 3.7, "JSON / Markdown")
    flow(2.2, 3.5, 4.1, 4.3, "用例文件 I/O")

    plt.title("图 4-3  数据流图（DFD 一层展开）", fontsize=13, pad=10)
    plt.tight_layout()
    out = os.path.join(OUT_DIR, "fig_dfd.png")
    plt.savefig(out, bbox_inches="tight")
    plt.close()
    return out


# ============== 4. E-R 图 ==============
def draw_er_diagram():
    fig, ax = plt.subplots(figsize=(12, 8), dpi=160)
    style_axes(ax)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)

    def entity(x, y, w, h, text):
        ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h,
                               fc="#E8F1FB", ec="#3A78C2", lw=1.4))
        ax.text(x, y, text, ha="center", va="center", fontsize=11, fontweight="bold")

    def attr(x, y, text, key=False):
        ax.add_patch(Ellipse((x, y), 1.55, 0.55, fc="#FAFAFA", ec="#888", lw=0.9))
        if key:
            ax.text(x, y, text, ha="center", va="center", fontsize=8.5,
                    fontweight="bold")
            # 下划线
            ax.plot([x - 0.4, x + 0.4], [y - 0.18, y - 0.18], color="black", lw=0.7)
        else:
            ax.text(x, y, text, ha="center", va="center", fontsize=8.5)

    def rel(x, y, text):
        pts = [(x, y + 0.45), (x + 0.9, y), (x, y - 0.45), (x - 0.9, y)]
        ax.add_patch(Polygon(pts, fc="#FFE9C7", ec="#B8702A", lw=1.3))
        ax.text(x, y, text, ha="center", va="center", fontsize=9, fontweight="bold")

    def line(x1, y1, x2, y2, label=""):
        ax.plot([x1, x2], [y1, y2], color="#333", lw=1.0)
        if label:
            ax.text((x1 + x2) / 2 + 0.1, (y1 + y2) / 2, label,
                    fontsize=8.5, color="#a33", ha="left")

    # 实体
    entity(2.5, 5.0, 2.3, 0.9, "Algorithm")
    entity(7.0, 5.0, 2.3, 0.9, "TestCase")
    entity(11.5, 5.0, 2.3, 0.9, "ExecutionLog")
    entity(7.0, 1.4, 2.3, 0.9, "Preference")

    # 关系
    rel(4.75, 5.0, "拥有")
    rel(9.25, 5.0, "产生")
    rel(7.0, 3.2, "包含")

    # 关系连线（含基数）
    line(3.65, 5.0, 3.85, 5.0, "1")
    line(5.65, 5.0, 5.85, 5.0, "N")
    line(8.15, 5.0, 8.35, 5.0, "1")
    line(10.15, 5.0, 10.35, 5.0, "N")

    line(7.0, 4.55, 7.0, 3.65, "1")
    line(7.0, 2.75, 7.0, 1.85, "N")

    # Algorithm 属性
    attr(0.9, 7.0, "id", key=True)
    attr(2.5, 7.5, "name")
    attr(4.1, 7.0, "category")
    attr(0.9, 3.0, "difficulty")
    attr(2.5, 2.5, "timeC")
    attr(4.1, 3.0, "spaceC")
    for ax_x, ax_y in [(0.9, 6.75), (2.5, 7.25), (4.1, 6.75),
                       (0.9, 3.25), (2.5, 2.75), (4.1, 3.25)]:
        line(ax_x, ax_y, 2.5, 4.55)

    # TestCase 属性
    attr(5.5, 7.4, "id", key=True)
    attr(7.0, 7.7, "name")
    attr(8.5, 7.4, "payload")
    attr(8.7, 6.6, "createdAt")
    for ax_x, ax_y in [(5.5, 7.15), (7.0, 7.45), (8.5, 7.15), (8.7, 6.35)]:
        line(ax_x, ax_y, 7.0, 5.45)

    # ExecutionLog 属性
    attr(10.0, 7.0, "id", key=True)
    attr(11.5, 7.5, "steps")
    attr(13.1, 7.0, "duration")
    attr(13.1, 3.0, "createdAt")
    attr(10.0, 3.0, "result")
    for ax_x, ax_y in [(10.0, 6.75), (11.5, 7.25), (13.1, 6.75),
                       (13.1, 3.25), (10.0, 3.25)]:
        line(ax_x, ax_y, 11.5, 4.55)

    # Preference 属性
    attr(5.5, 0.5, "key", key=True)
    attr(8.5, 0.5, "value")
    line(5.5, 0.75, 7.0, 0.95)
    line(8.5, 0.75, 7.0, 0.95)

    plt.title("图 4-4  本地数据 E-R 图", fontsize=13, pad=10)
    plt.tight_layout()
    out = os.path.join(OUT_DIR, "fig_er.png")
    plt.savefig(out, bbox_inches="tight")
    plt.close()
    return out


# ============== 5. 状态机图：播放控制 ==============
def draw_state_machine():
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=160)
    style_axes(ax)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6)

    def state(x, y, text):
        ax.add_patch(FancyBboxPatch((x - 0.95, y - 0.5), 1.9, 1.0,
                                    boxstyle="round,pad=0.05",
                                    fc="#E8F1FB", ec="#3A78C2", lw=1.3))
        ax.text(x, y, text, ha="center", va="center", fontsize=11, fontweight="bold")

    def trans(x1, y1, x2, y2, label, rad=0.2, color="#333"):
        arr = FancyArrowPatch((x1, y1), (x2, y2),
                              connectionstyle=f"arc3,rad={rad}",
                              arrowstyle="-|>", mutation_scale=14, color=color, lw=1.0)
        ax.add_patch(arr)
        ax.text((x1 + x2) / 2, (y1 + y2) / 2 + 0.4, label, fontsize=9, ha="center")

    # 起点
    ax.add_patch(Circle((1, 4.5), 0.16, fc="black"))
    state(2.8, 4.5, "idle")
    state(6.0, 4.5, "running")
    state(9.2, 4.5, "paused")
    state(6.0, 1.5, "completed")
    # 终点
    ax.add_patch(Circle((11.0, 1.5), 0.18, fc="white", ec="black", lw=1.5))
    ax.add_patch(Circle((11.0, 1.5), 0.10, fc="black"))

    # 转换
    ax.annotate("", xy=(1.85, 4.5), xytext=(1.16, 4.5),
                arrowprops=dict(arrowstyle="-|>", lw=1.0))
    trans(3.75, 4.5, 5.05, 4.5, "play()")
    trans(5.05, 4.55, 3.75, 4.55, "reset()", rad=0.3)
    trans(6.95, 4.5, 8.25, 4.5, "pause()")
    trans(8.25, 4.55, 6.95, 4.55, "play()", rad=0.3)
    trans(6.0, 4.0, 6.0, 2.0, "lastStep done", rad=0.0)
    trans(5.5, 1.8, 3.4, 4.1, "reset()", rad=0.3)
    trans(6.95, 1.5, 10.85, 1.5, "exit", rad=0.0)

    # 自循环
    ax.annotate("", xy=(2.6, 4.95), xytext=(3.0, 5.05),
                arrowprops=dict(arrowstyle="-|>",
                                connectionstyle="arc3,rad=2", lw=0.8))
    ax.text(2.8, 5.55, "stepForward()", fontsize=8, ha="center")

    plt.title("图 4-5  播放控制状态机图", fontsize=13, pad=10)
    plt.tight_layout()
    out = os.path.join(OUT_DIR, "fig_state.png")
    plt.savefig(out, bbox_inches="tight")
    plt.close()
    return out


if __name__ == "__main__":
    p1 = draw_use_case_diagram()
    p2 = draw_activity_diagram()
    p3 = draw_dfd_diagram()
    p4 = draw_er_diagram()
    p5 = draw_state_machine()
    print("Generated:")
    for p in [p1, p2, p3, p4, p5]:
        print(" ", p)
