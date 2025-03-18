<template>
  <div class="profile-container">
    <ElRow :gutter="20">
      <ElCol :span="8">
        <!-- 个人资料卡片 -->
        <ElCard class="profile-card">
          <div class="profile-header">
            <div class="avatar-container">
              <ElAvatar :size="100" :src="userInfo.avatar">
                {{ userInitials }}
              </ElAvatar>
              <ElButton class="change-avatar-btn" size="small" circle>
                <ElIcon>
                  <Camera />
                </ElIcon>
              </ElButton>
            </div>
            <h2 class="username">{{ userInfo.username }}</h2>
            <p class="user-role">{{ userInfo.roles?.join(', ') || '普通用户' }}</p>
          </div>
          <ElDivider />
          <div class="profile-info">
            <div class="info-item">
              <ElIcon>
                <User />
              </ElIcon>
              <span>账号创建于 {{ formatDate((userInfo as any).createdAt) }}</span>
            </div>
            <div class="info-item">
              <ElIcon>
                <Location />
              </ElIcon>
              <span>{{ (userInfo as any).location || '未设置位置' }}</span>
            </div>
            <div class="info-item">
              <ElIcon>
                <Message />
              </ElIcon>
              <span>{{ (userInfo as any).email || '未设置邮箱' }}</span>
            </div>
            <div class="info-item">
              <ElIcon>
                <Cellphone />
              </ElIcon>
              <span>{{ maskPhoneNumber((userInfo as any).phone) || '未设置手机' }}</span>
            </div>
          </div>
        </ElCard>
      </ElCol>

      <ElCol :span="16">
        <!-- 基本信息 -->
        <ElCard class="profile-form-card">
          <template #header>
            <div class="card-header">
              <h3>基本信息</h3>
            </div>
          </template>

          <ElForm ref="basicFormRef" :model="basicForm" label-width="100px" :rules="basicRules">
            <ElFormItem label="用户名" prop="username">
              <ElInput v-model="basicForm.username" />
            </ElFormItem>
            <ElFormItem label="昵称" prop="nickname">
              <ElInput v-model="basicForm.nickname" />
            </ElFormItem>
            <ElFormItem label="邮箱" prop="email">
              <ElInput v-model="basicForm.email" />
            </ElFormItem>
            <ElFormItem label="手机号" prop="phone">
              <ElInput v-model="basicForm.phone" />
            </ElFormItem>
            <ElFormItem label="所在地区">
              <ElCascader
                v-model="basicForm.location"
                :options="locationOptions"
                placeholder="请选择所在地区"
              />
            </ElFormItem>
            <ElFormItem label="个人简介">
              <ElInput v-model="basicForm.bio" type="textarea" :rows="3" />
            </ElFormItem>
            <ElFormItem>
              <ElButton type="primary" @click="saveBasicInfo" :loading="saveLoading"
                >保存修改</ElButton
              >
              <ElButton @click="resetBasicForm">重置</ElButton>
            </ElFormItem>
          </ElForm>
        </ElCard>

        <!-- 账号安全 -->
        <ElCard class="profile-form-card">
          <template #header>
            <div class="card-header">
              <h3>账号安全</h3>
            </div>
          </template>

          <div class="security-list">
            <div class="security-item">
              <div class="security-info">
                <h4>登录密码</h4>
                <p>定期修改密码可以提高账号安全性</p>
              </div>
              <ElButton @click="showPasswordDialog = true">修改</ElButton>
            </div>
            <ElDivider />
            <div class="security-item">
              <div class="security-info">
                <h4>手机绑定</h4>
                <p>已绑定：{{ maskPhoneNumber((userInfo as any).phone) || '未绑定手机号' }}</p>
              </div>
              <ElButton @click="showPhoneDialog = true">{{
                (userInfo as any).phone ? '修改' : '绑定'
              }}</ElButton>
            </div>
            <ElDivider />
            <div class="security-item">
              <div class="security-info">
                <h4>邮箱绑定</h4>
                <p>已绑定：{{ maskEmail((userInfo as any).email) || '未绑定邮箱' }}</p>
              </div>
              <ElButton @click="showEmailDialog = true">{{
                (userInfo as any).email ? '修改' : '绑定'
              }}</ElButton>
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 修改密码对话框 -->
    <ElDialog v-model="showPasswordDialog" title="修改密码" width="500px" destroy-on-close>
      <ElForm
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <ElFormItem label="当前密码" prop="oldPassword">
          <ElInput v-model="passwordForm.oldPassword" type="password" show-password />
        </ElFormItem>
        <ElFormItem label="新密码" prop="newPassword">
          <ElInput v-model="passwordForm.newPassword" type="password" show-password />
        </ElFormItem>
        <ElFormItem label="确认新密码" prop="confirmPassword">
          <ElInput v-model="passwordForm.confirmPassword" type="password" show-password />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="showPasswordDialog = false">取消</ElButton>
        <ElButton type="primary" @click="changePassword" :loading="saveLoading">确认</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { User, Camera, Location, Message, Cellphone } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useAuthStore } from '@/stores';

// 定义扩展的用户信息接口
interface ExtendedUserInfo {
  username: string;
  avatar: string;
  roles?: string[];
  permissions?: string[];
  createdAt: string;
  location: string;
  email: string;
  phone: string;
  nickname: string;
  bio: string;
}

// 获取用户信息
const authStore = useAuthStore();
const userInfo = computed(() => {
  return (
    authStore.userInfo ||
    ({
      username: '',
      avatar: '',
      roles: [],
      permissions: [],
      createdAt: new Date().toISOString(),
      location: '',
      email: '',
      phone: '',
      nickname: '',
      bio: '',
    } as ExtendedUserInfo)
  );
});

// 计算用户名首字母
const userInitials = computed(() => {
  if (!userInfo.value.username) return '';
  return userInfo.value.username.slice(0, 2).toUpperCase();
});

// 基本信息表单
const basicFormRef = ref<FormInstance>();
const basicForm = reactive({
  username: userInfo.value.username || '',
  nickname: (userInfo.value as any).nickname || '',
  email: (userInfo.value as any).email || '',
  phone: (userInfo.value as any).phone || '',
  location: (userInfo.value as any).location ? (userInfo.value as any).location.split(',') : [],
  bio: (userInfo.value as any).bio || '',
});

// 基本信息验证规则
const basicRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '邮箱格式不正确',
      trigger: 'blur',
    },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
});

// 密码表单
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 密码验证规则
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const passwordRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
});

// 地区选项（示例数据）
const locationOptions = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      { value: 'chaoyang', label: '朝阳区' },
      { value: 'haidian', label: '海淀区' },
    ],
  },
  {
    value: 'shanghai',
    label: '上海',
    children: [
      { value: 'pudong', label: '浦东新区' },
      { value: 'huangpu', label: '黄浦区' },
    ],
  },
];

// 对话框控制
const showPasswordDialog = ref(false);
const showPhoneDialog = ref(false);
const showEmailDialog = ref(false);
const saveLoading = ref(false);

// 保存基本信息
const saveBasicInfo = async () => {
  if (!basicFormRef.value) return;

  await basicFormRef.value.validate(async (valid) => {
    if (valid) {
      saveLoading.value = true;

      try {
        // 模拟API请求
        await new Promise((resolve) => setTimeout(resolve, 1000));

        ElMessage.success('个人信息保存成功');
      } catch (error) {
        ElMessage.error('保存失败，请稍后重试');
      } finally {
        saveLoading.value = false;
      }
    }
  });
};

// 重置基本信息表单
const resetBasicForm = () => {
  if (basicFormRef.value) {
    basicFormRef.value.resetFields();
  }
};

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return;

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      saveLoading.value = true;

      try {
        // 模拟API请求
        await new Promise((resolve) => setTimeout(resolve, 1000));

        ElMessage.success('密码修改成功');
        showPasswordDialog.value = false;
      } catch (error) {
        ElMessage.error('修改失败，请稍后重试');
      } finally {
        saveLoading.value = false;
      }
    }
  });
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// 手机号码脱敏
const maskPhoneNumber = (phone: string) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 邮箱脱敏
const maskEmail = (email: string) => {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;

  let username = parts[0];
  const domain = parts[1];

  if (username.length <= 3) {
    username = username.charAt(0) + '**';
  } else {
    username = username.charAt(0) + '***' + username.charAt(username.length - 1);
  }

  return `${username}@${domain}`;
};

onMounted(() => {
  // 初始化用户数据
});
</script>

<style scoped>
.profile-container {
  padding: 20px 0;
}

.profile-card {
  margin-bottom: 20px;
  transition: all 0.3s;
  border-radius: 8px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
}

.avatar-container {
  position: relative;
  margin-bottom: 16px;
}

.change-avatar-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: var(--primary-color);
  color: #fff;
  border: 2px solid #fff;
  transition: all 0.3s;
}

.change-avatar-btn:hover {
  background-color: var(--primary-hover);
  transform: scale(1.1);
}

.username {
  margin: 8px 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-role {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.profile-info {
  padding: 8px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.info-item .el-icon {
  margin-right: 8px;
  font-size: 16px;
}

.profile-form-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.security-list {
  padding: 8px 0;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.security-info h4 {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.security-info p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
