<script lang="ts">
  import { createReference, type CreateReferenceDto } from '$lib/api/references';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';

  interface Props {
    onSuccess?: () => void;
    onCancel?: () => void;
  }

  let { onSuccess, onCancel }: Props = $props();

  // 폼 상태
  let process = $state<'design' | 'development' | 'testing' | 'deployment'>('design');
  let phase = $state('');
  let avail = $state<'Y' | 'N'>('Y');
  let userId = $state('');
  let userName = $state('');
  let userEmail = $state('');

  let loading = $state(false);
  let error = $state<string | null>(null);

  // 폼 제출
  async function handleSubmit(e: Event) {
    e.preventDefault();

    // 유효성 검사
    if (!phase.trim()) {
      error = 'Phase는 필수 입력 항목입니다.';
      return;
    }

    if (!userId.trim() || !userName.trim() || !userEmail.trim()) {
      error = '사용자 정보를 모두 입력해주세요.';
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      error = '올바른 이메일 형식을 입력해주세요.';
      return;
    }

    loading = true;
    error = null;

    try {
      const data: CreateReferenceDto = {
        process,
        phase,
        avail,
        createUser: {
          id: userId,
          name: userName,
          email: userEmail
        }
      };

      await createReference(data);

      // 폼 초기화
      process = 'design';
      phase = '';
      avail = 'Y';
      userId = '';
      userName = '';
      userEmail = '';

      // 성공 콜백 호출
      onSuccess?.();
    } catch (e) {
      error = 'Reference 추가에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 취소
  function handleCancel() {
    // 폼 초기화
    process = 'design';
    phase = '';
    avail = 'Y';
    userId = '';
    userName = '';
    userEmail = '';
    error = null;

    onCancel?.();
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}

  <div class="form-row">
    <div class="form-group">
      <label for="process">Process <span class="required">*</span></label>
      <select id="process" bind:value={process} disabled={loading} class="select-input">
        <option value="design">Design</option>
        <option value="development">Development</option>
        <option value="testing">Testing</option>
        <option value="deployment">Deployment</option>
      </select>
    </div>

    <div class="form-group">
      <label for="avail">Avail <span class="required">*</span></label>
      <select id="avail" bind:value={avail} disabled={loading} class="select-input">
        <option value="Y">Y</option>
        <option value="N">N</option>
      </select>
    </div>
  </div>

  <div class="form-group">
    <label for="phase">Phase <span class="required">*</span></label>
    <Input
      id="phase"
      type="text"
      bind:value={phase}
      placeholder="Phase를 입력하세요 (예: Phase 1)"
      disabled={loading}
    />
  </div>

  <div class="divider">
    <span>Create User Information</span>
  </div>

  <div class="form-group">
    <label for="userId">User ID <span class="required">*</span></label>
    <Input
      id="userId"
      type="text"
      bind:value={userId}
      placeholder="사용자 ID를 입력하세요"
      disabled={loading}
    />
  </div>

  <div class="form-group">
    <label for="userName">User Name <span class="required">*</span></label>
    <Input
      id="userName"
      type="text"
      bind:value={userName}
      placeholder="사용자 이름을 입력하세요"
      disabled={loading}
    />
  </div>

  <div class="form-group">
    <label for="userEmail">User Email <span class="required">*</span></label>
    <Input
      id="userEmail"
      type="email"
      bind:value={userEmail}
      placeholder="사용자 이메일을 입력하세요"
      disabled={loading}
    />
  </div>

  <div class="form-actions">
    <Button type="button" variant="outline" onclick={handleCancel} disabled={loading}>취소</Button>
    <Button type="submit" disabled={loading}>
      {loading ? '추가 중...' : '추가'}
    </Button>
  </div>
</form>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .required {
    color: hsl(var(--destructive));
  }

  .select-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(var(--input));
    border-radius: 0.375rem;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  .select-input:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1);
  }

  .select-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: hsl(var(--border));
  }

  .divider span {
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }

  .error-message {
    padding: 0.75rem 1rem;
    background-color: hsl(var(--destructive) / 0.1);
    border: 1px solid hsl(var(--destructive) / 0.3);
    border-radius: 0.375rem;
    color: hsl(var(--destructive));
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid hsl(var(--border));
  }
</style>
