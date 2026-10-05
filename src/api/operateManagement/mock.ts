let data: OperateManagementDataAPI.OperateTagType[] = [];

for (let i = 0; i < 50; i++) {
  data.push({
    id: i,
    level: (i % 3) + 1,
    name: `OperateTag${i}`,
    userCount: i,
    remark: `remark${i}`
  });
}

const getOperateTagList = (
  fetchProps: OperateManagementDataAPI.OperateTagListSearchProps
) => {
  return new Promise<OperateManagementDataAPI.OperateTagListRes>(
    (resolve, reject) => {
      setTimeout(() => {
        const { pageSize, pageNum } = fetchProps;
        if (data.length < pageSize * (pageNum - 1)) {
          reject('There are no histories match');
        }
        const list = [...data].filter(
          (_, index) =>
            index >= pageSize * (pageNum - 1) && index < pageSize * pageNum
        );
        resolve({
          code: 0,
          data: {
            records: list,
            total: data.length,
            size: pageSize,
            current: pageNum
          },
          msg: '成功获取标签目录'
        });
      }, 1000);
    }
  );
};

const updateOperateTag = (
  dataProp: OperateManagementDataAPI.OperateTagType
) => {
  return new Promise<OperateManagementDataAPI.OperateTagRes>(
    (resolve, reject) => {
      setTimeout(() => {
        const { id } = dataProp;
        if (data.findIndex(item => item.id === id) < 0) {
          reject('There are no histories match');
        }
        data = data.map(item => (item.id === id ? dataProp : item));
        resolve({
          code: 0,
          data: dataProp,
          msg: '成功更新标签信息'
        });
      }, 1000);
    }
  );
};
const createOperateTag = (
  dataProp: OperateManagementDataAPI.OperateTagType
) => {
  return new Promise<OperateManagementDataAPI.OperateTagRes>(
    (resolve, reject) => {
      setTimeout(() => {
        const newData = { ...dataProp, id: data[data.length - 1].id + 1 };
        data.push(newData);
        // data = [newData, ...data];
        resolve({
          code: 0,
          data: newData,
          msg: '成功创建标签'
        });
      }, 1000);
    }
  );
};

const deleteOperateTag = (
  dataProp: OperateManagementDataAPI.OperateTagType
) => {
  return new Promise<OperateManagementDataAPI.OperateTagRes>(
    (resolve, reject) => {
      setTimeout(() => {
        const { id } = dataProp;
        data = data.filter(item => item.id !== id);
        resolve({
          code: 0,
          data: null,
          msg: '成功删除标签'
        });
      }, 1000);
    }
  );
};

const mockAPI = {
  getOperateTagList,
  updateOperateTag,
  createOperateTag,
  deleteOperateTag
};

export default mockAPI;
