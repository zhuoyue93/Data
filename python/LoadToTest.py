from keras.models import load_model

modeltest = load_model('house_model.h5')
from keras.datasets import boston_housing

# boston房价数据集，预测房价变化
(train_data, train_targets), (test_data, test_targets) = boston_housing.load_data()

print('train_data shape ', train_data.shape)
print('test_data.shape ', test_data.shape)

# print('train_targets: ', train_targets)

# 预处理数据，转化为正态分布
mean = train_data.mean(axis=0)  # 求均值
train_data -= mean

std = train_data.std(axis=0)  # 求标准差
train_data /= std

test_data -= mean
test_data /= std

# 获取预测结果:test_result=modeltest.predict(test_data[:1]);
test_result = modeltest.predict(test_data)

# 显示实际结果和预测结果：PS：二维数组的size等于两个维度的乘积
for i in range(test_result.size):
    print('test_data: ', test_targets[i], test_result[i])

# test_mse_score, test_mae_score = modeltest.evaluate(test_data, test_targets)
# print('test_mae_score: ', test_mae_score)  # Mean Squared Error
