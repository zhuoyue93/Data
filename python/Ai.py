from keras.datasets import boston_housing

# boston房价数据集，预测房价变化
(train_data, train_targets), (test_data, test_targets) = boston_housing.load_data()

print('train_data shape ', train_data.shape)
print('test_data.shape ', test_data.shape)

print('train_targets: ', train_targets)

# 预处理数据，转化为正态分布
mean = train_data.mean(axis=0)  # 求均值
train_data -= mean

std = train_data.std(axis=0)  # 求标准差
train_data /= std

test_data -= mean
test_data /= std

# 搭建模型

from keras import models
from keras import layers


def build_network():
    network = models.Sequential()
    network.add(layers.Dense(64, activation='relu', input_shape=(train_data.shape[1], )))
    network.add(layers.Dense(64, activation='relu'))
    network.add(layers.Dense(1))
    network.compile(optimizer='rmsprop', loss='mse', metrics=['mae'])  # 均方误差作为损失
    return network

# k-fold 验证 , 基于numpy实现
import numpy as np

k = 4
num_val_samples = len(train_data)//k
num_epochs = 500
all_scores = []
all_mae_histories = []

for i in range(k):
    print("processing fold #", i)
    # Prepare the validation data
    val_data = train_data[i*num_val_samples: (i+1)*num_val_samples]
    val_targets = train_targets[i*num_val_samples: (i+1)*num_val_samples]

    #Prepare the training dataa: data from all other partitions
    partial_train_data = np.concatenate(
        [train_data[: i*num_val_samples],
         train_data[(i+1)*num_val_samples:]],
        axis=0
    )
    partial_train_targets = np.concatenate(
        [train_targets[: i*num_val_samples],
         train_targets[(i+1)*num_val_samples:]],
        axis=0
    )
    network = build_network()
    # 记录每次迭代的训练集和验证集 acc和loss
    history = network.fit(partial_train_data, partial_train_targets, epochs=num_epochs,
                          batch_size=1, verbose=1,
                          validation_data=(val_data, val_targets))

    mae_history = history.history['val_mean_absolute_error']
    all_mae_histories.append(mae_history)
    # val_mse, val_mae = network.evaluate(val_data, val_targets, verbose=1)
    #
    # all_scores.append(val_mae)

# print('all_scores: ', all_scores)
# print('mean ', np.mean(all_scores))
average_mae_history = [np.mean([x[i] for x in all_mae_histories]) for i in range(num_epochs)]
print('average_mae_history: ', average_mae_history)

# Plotting validation scores
import matplotlib.pyplot as plt

plt.plot(range(1, len(average_mae_history)+1), average_mae_history)
plt.xlabel('Epochs')
plt.ylabel('Validation MAE')
plt.show()

# -------------------------------
plt.clf()

def smooth_curve(points, factor=0.9):
    smoothed_points = []
    for point in points:
        if smoothed_points:
            previous = smoothed_points[-1]
            smoothed_points.append(previous*factor + point*(1-factor))
        else:
            smoothed_points.append(point)
    return smoothed_points

smooth_mae_history = smooth_curve(average_mae_history[10:])

plt.plot(range(1, len(smooth_mae_history)+1), smooth_mae_history)
plt.xlabel('Epochs')
plt.ylabel('Validation MAE')
plt.show()

# 根据前面的MAE分析， epochs=80 会是一个合适的模型,下面重新训练模型

model = build_network()
model.fit(train_data, train_targets,
          epochs=80, batch_size=16, verbose=0)

test_mse_score, test_mae_score = model.evaluate(test_data, test_targets)

print('test_mae_score: ', test_mae_score)  # Mean Squared Error
