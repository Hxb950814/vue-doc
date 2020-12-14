/* 通用的列表数据mixin */
import {Component, Vue} from 'vue-property-decorator';

interface MenuData {
    level1Name: string; // 一级名称
    level1Id: string; // id
    level1Checked: boolean; // 是否选中
    level1RowSpanNum?: number; // 第一级向下折叠的数值
    /* split */
    level2Name?: string; // 二级名称
    level2Id?: string; // id
    level2Checked?: boolean; // 是否选中
    level2RowSpanNum?: number; // 第二级向下折叠的数值
    /* split */
    level3Name?: string; // 三级名称
    level3Id?: string; // id
    level3Checked?: boolean; // 是否选中
    level3Items?: Array<{
        name: string;
        id: string;
        checked: boolean;
    }>;
}

@Component
export default class extends Vue {
    protected dataList: Array<MenuData> = [];

    protected onLevel1Change(level1Id: string, checked: boolean) {
        // 当一级菜单取消勾选时，下面的二三四级菜单都被取消勾选
        const find = this.dataList.find((item: any) => {
            return level1Id === item.level1Id; // 找到id
        });
        const keepLevel1Id = find?.level1Id || '-1';
        for (let i = 0; i < this.dataList.length; ++i) {
            const item = this.dataList[i];
            if (item.level1Id === keepLevel1Id) {
                item.level1Checked = checked; // 全部选中或者关闭
                if (!checked) {
                    item.level2Checked = false;
                    item.level3Checked = false;
                    if (item.level3Items) {
                        for (let j = 0; j < item.level3Items.length; ++j) {
                            item.level3Items[j].checked = false; // 取消勾选四级菜单
                        }
                    }
                }
            }
        }
    }

    protected onLevel2Change(level2Id: string, checked: boolean) {
        // 当二级菜单勾选时，上面的一级菜单都被选中
        // 当二级菜单取消勾选时，下面的三四级菜单都被取消勾选
        const find = this.dataList.find((item: any) => {
            return level2Id === item.level2Id; // 找到id
        });
        const keepLevel1Id = find?.level1Id || '-1';
        const keepLevel2Id = find?.level2Id || '-1';

        for (let i = 0; i < this.dataList.length; ++i) {
            const item = this.dataList[i];
            if (keepLevel1Id === item.level1Id) {
                if (checked) {
                    item.level1Checked = true;
                }
            }
            if (keepLevel2Id === item.level2Id) {
                if (checked) { // 勾选
                    item.level2Checked = true;
                } else { // 取消勾选
                    item.level3Checked = false; // 取消勾选三级菜单
                    if (item.level3Items) {
                        for (let j = 0; j < item.level3Items.length; ++j) {
                            item.level3Items[j].checked = false; // 取消勾选四级菜单
                        }
                    }
                }
            }
        }
    }

    protected onLevel3Change(level3Id: string, checked: boolean) {
        // 当三级菜单勾选时，上面的一二级菜单都被选中
        // 当三级菜单取消勾选时，下面的四级菜单都被取消勾选
        const find = this.dataList.find((item: any) => {
            return level3Id === item.level3Id; // 找到id
        });
        const keepLevel1Id = find?.level1Id || '-1';
        const keepLevel2Id = find?.level2Id || '-1';
        const keepLevel3Id = find?.level3Id || '-1';

        for (let i = 0; i < this.dataList.length; ++i) {
            const item = this.dataList[i];
            if (keepLevel1Id === item.level1Id) {
                if (checked) {
                    item.level1Checked = true;
                }
            }
            if (keepLevel2Id === item.level2Id) {
                if (checked) {
                    item.level2Checked = true;
                }
            }
            if (keepLevel3Id === item.level3Id) {
                if (checked) { // 勾选
                    // todo
                } else if (item.level3Items) {
                    for (let j = 0; j < item.level3Items.length; ++j) {
                        item.level3Items[j].checked = false; // 取消勾选四级菜单
                    }
                }
            }
        }
    }

    protected onLevel4Change(level4Id: string, checked: boolean) {
        // 当四级菜单勾选时，上面的一二三级菜单都被选中
        let keepLevel1Id = '';
        let keepLevel2Id = '';
        let keepLevel3Id = '';
        for (let i = 0; i < this.dataList.length; ++i) {
            const item = this.dataList[i];
            let breakFlg = false;
            if (item.level3Items) {
                for (let j = 0; j < item.level3Items.length; ++j) {
                    if (item.level3Items[j].checked) {
                        keepLevel1Id = item.level1Id; // level1Id都是相同的
                        keepLevel2Id = item.level2Id || ''; // level2Id都是相同的
                        keepLevel3Id = item.level3Id || ''; // level3Id都是相同的
                        breakFlg = true;
                        break;
                    }
                }
            }
            if (breakFlg) {
                break;
            }
        }

        for (let i = 0; i < this.dataList.length; ++i) {
            const item = this.dataList[i];
            if (keepLevel1Id === item.level1Id) {
                if (checked) {
                    item.level1Checked = true;
                }
            }
            if (keepLevel2Id === item.level2Id) {
                if (checked) {
                    item.level2Checked = true;
                }
            }
            if (keepLevel3Id === item.level3Id) {
                if (checked) { // 勾选
                    item.level3Checked = true;
                }
            }
        }
    }

    protected handleListData(data: any[]) {
        const list: MenuData[] = [];
        for (let it1 = 0; it1 < data.length; ++it1) { // 第一层循环 遍历第一层数据
            const objLevel1 = data[it1];
            if (!objLevel1.chridrenList || objLevel1?.chridrenList?.length === 0) { // 第一级直接没有子级
                list.push({
                    level1Name: objLevel1.name, // 名称
                    level1Id: String(objLevel1.code), // id
                    level1Checked: Number(objLevel1.checked) === 1 // 是否选中
                });
                continue;
            }
            for (let it2 = 0; it2 < objLevel1.chridrenList.length; ++it2) { // 第二层循环 遍历第二层数据
                const objLevel2 = objLevel1.chridrenList[it2];
                if (!objLevel2.chridrenList || objLevel2?.chridrenList?.length === 0) {
                    list.push({
                        level1Name: objLevel1.name, // 一级名称
                        level1Id: String(objLevel1.code), // id
                        level1Checked: Number(objLevel1.checked) === 1, // 是否选中
                        level2Name: objLevel2.name, // 二级名称
                        level2Id: String(objLevel2.code), // id
                        level2Checked: Number(objLevel2.checked) === 1 // 是否选中
                    });
                    continue;
                }
                for (let it3 = 0; it3 < objLevel2.chridrenList.length; ++it3) { // 第三层循环 遍历第三层数据
                    const objLevel3 = objLevel2.chridrenList[it3];
                    const level3Items = [];
                    if (objLevel3.chridrenList || objLevel3?.chridrenList?.length === 0) {
                        for (let it4 = 0; it4 < objLevel3.chridrenList.length; ++it4) { // 第四层循环 遍历第四层数据
                            const objLevel4 = objLevel3.chridrenList[it4];
                            level3Items.push({
                                name: objLevel4.name,
                                id: String(objLevel4.code),
                                checked: Number(objLevel4.checked) === 1
                            });
                        }
                    }

                    list.push({
                        level1Name: objLevel1.name, // 一级名称
                        level1Id: String(objLevel1.code), // id
                        level1Checked: Number(objLevel1.checked) === 1, // 是否选中
                        level2Name: objLevel2.name, // 二级名称
                        level2Id: String(objLevel2.code), // id
                        level2Checked: Number(objLevel2.checked) === 1, // 是否选中
                        level3Name: objLevel3.name, // 三级名称
                        level3Id: String(objLevel3.code), // id
                        level3Checked: Number(objLevel3.checked) === 1, // 是否选中
                        level3Items
                    });
                }
            }
        }

        this.unfoldListData(list, 1); // 折叠一级
        this.unfoldListData(list, 2); // 折叠二级
        this.dataList = list;
        console.log(list);
    }

    // 对数据折叠
    protected unfoldListData(list: any[], level: number) {
        let iter1 = 'level1Id'; // 第一级折叠
        let spanRowsKey = 'level1RowSpanNum';
        if (level === 2) { // 第一级折叠
            iter1 = 'level2Id';
            spanRowsKey = 'level2RowSpanNum';
        }
        // 对第一级进行合并列
        let keepId = '';
        let keepValue = 0;
        for (let i = 0; i < list.length; i++) {
            const childCurr = list[i];
            // console.log(childCurr[iter1]);
            if (childCurr[iter1] && (childCurr[iter1] === keepId || keepId === '')) { // 如果相同，指针+1
                // console.log('同', childCurr.level1Name, childCurr.level1Id);
                childCurr[spanRowsKey] = 0;
                keepValue++;
                keepId = childCurr[iter1];
            } else { // 如果不同，指针归0, 将前面的span折叠
                if (keepValue > 0 && list[i - keepValue]) { // 将
                    list[i - keepValue][spanRowsKey] = keepValue;
                    // console.log('不同', childCurr.level1Name, keepValue);
                }
                childCurr[spanRowsKey] = 1;
                keepValue = 1;
                keepId = childCurr[iter1];
            }
        }
        if (keepValue > 1) {
            list[list.length - keepValue][spanRowsKey] = keepValue;
        }
    }
}
