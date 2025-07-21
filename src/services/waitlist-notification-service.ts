import type {
  NotificationConfig,
  NotificationTier,
  WaitlistResponse,
} from '@/types/waitlist';

export class WaitlistNotificationService {
  /**
   * Generate notification configuration based on waitlist response
   */
  static generateNotification(
    response: WaitlistResponse,
    locale: string = 'zh'
  ): NotificationConfig {
    // Normalize locale to handle edge cases
    const normalizedLocale = locale?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    const { queue_position, estimated_wait_weeks, position_tier } = response;
    
    if (!queue_position) {
      return this.getDefaultNotification(normalizedLocale);
    }

    const tier = position_tier || this.calculateTier(queue_position);
    const message = this.getLocalizedMessage(tier, normalizedLocale, {
      position: queue_position,
      weeks: estimated_wait_weeks || this.estimateWeeks(queue_position),
      total: response.total_submissions || undefined
    });

    return {
      type: tier === 'priority' ? 'success' : 'info',
      title: this.getLocalizedTitle(tier, normalizedLocale),
      message,
      duration: tier === 'priority' ? 12000 : 8000, // Longer for VIP
      celebratory: tier === 'priority' && queue_position <= 50,
      actions: this.getContextualActions(tier, normalizedLocale)
    };
  }

  /**
   * Calculate tier based on position
   */
  private static calculateTier(position: number): NotificationTier {
    if (position <= 50) {
 return 'priority'; 
}
    if (position <= 500) {
 return 'regular'; 
}
    return 'extended';
  }

  /**
   * Estimate wait weeks if not provided
   */
  private static estimateWeeks(position: number): number {
    const tier = this.calculateTier(position);
    const baseWeeksPer100 = 2;
    
    const multiplier = tier === 'priority' ? 0.5 : tier === 'regular' ? 0.8 : 1.2;
    return Math.max(1, Math.min(12, Math.ceil((position / 100) * baseWeeksPer100 * multiplier)));
  }

  /**
   * Get localized notification title
   */
  private static getLocalizedTitle(tier: NotificationTier, locale: string): string {
    const titles = {
      zh: {
        priority: '🎉 优先处理',
        regular: '✅ 申请已收到',
        extended: '📝 申请已提交'
      },
      en: {
        priority: '🎉 Priority Status',
        regular: '✅ Application Received',
        extended: '📝 Application Submitted'
      }
    };

    return titles[locale as keyof typeof titles]?.[tier] || titles.zh[tier];
  }

  /**
   * Get localized notification message
   */
  private static getLocalizedMessage(
    tier: NotificationTier,
    locale: string,
    data: { position: number; weeks: number; total?: number }
  ): string {
    const messages = {
      zh: {
        priority: `恭喜！您是前 ${data.position} 位申请者，享有优先审核资格。预计 ${data.weeks} 周内收到邀请通知。`,
        regular: `申请已成功提交！您是第 ${data.position} 位申请者，预计 ${data.weeks} 周内收到回复。`,
        extended: `感谢申请！您是第 ${data.position} 位申请者，虽然需要等待，但我们会认真审核每位申请。预计 ${data.weeks} 周内收到回复。`
      },
      en: {
        priority: `Congratulations! You're among our first ${data.position} applicants with priority review status. Expect to hear from us within ${data.weeks} weeks.`,
        regular: `Application received successfully! You're #${data.position} in line. We'll get back to you within ${data.weeks} weeks.`,
        extended: `Thank you for applying! You're #${data.position} in our queue. While there's a wait, we review every application carefully. Expect to hear within ${data.weeks} weeks.`
      }
    };

    return messages[locale as keyof typeof messages]?.[tier] || messages.zh[tier];
  }

  /**
   * Get contextual actions based on tier
   */
  private static getContextualActions(tier: NotificationTier, locale: string): Array<{
    key: string;
    label: string;
    handler: () => void;
  }> {
    const actions = {
      zh: {
        shareAction: { key: 'share', label: '分享给朋友', handler: () => this.handleShare() },
        trackAction: { key: 'track', label: '追踪状态', handler: () => this.handleTrackStatus() },
        feedbackAction: { key: 'feedback', label: '提供反馈', handler: () => this.handleFeedback() }
      },
      en: {
        shareAction: { key: 'share', label: 'Share with Friends', handler: () => this.handleShare() },
        trackAction: { key: 'track', label: 'Track Status', handler: () => this.handleTrackStatus() },
        feedbackAction: { key: 'feedback', label: 'Give Feedback', handler: () => this.handleFeedback() }
      }
    };

    const localeActions = actions[locale as keyof typeof actions] || actions.zh;
    
    switch (tier) {
      case 'priority':
        return [localeActions.shareAction];
      case 'regular':
        return [localeActions.trackAction, localeActions.shareAction];
      case 'extended':
        return [localeActions.feedbackAction];
      default:
        return [];
    }
  }

  /**
   * Default notification for cases without position data
   */
  private static getDefaultNotification(locale: string): NotificationConfig {
    const messages = {
      zh: {
        title: '✅ 申请已提交',
        message: '感谢您的申请！我们将尽快审核并与您联系。'
      },
      en: {
        title: '✅ Application Submitted',
        message: 'Thank you for your application! We\'ll review it and get back to you soon.'
      }
    };

    const msg = messages[locale as keyof typeof messages] || messages.zh;
    
    return {
      type: 'success',
      title: msg.title,
      message: msg.message,
      duration: 6000
    };
  }

  /**
   * Handle share action
   */
  private static handleShare(): void {
    if (navigator.share) {
      navigator.share({
        title: 'Lovpen 内测申请',
        text: '我已经成功申请了 Lovpen 内测，快来加入吧！',
        url: window.location.origin
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`我已经成功申请了 Lovpen 内测！快来 ${window.location.origin} 申请加入吧！`);
    }
  }

  /**
   * Handle track status action
   */
  private static handleTrackStatus(): void {
    // Could navigate to a status tracking page
    console.log('Tracking status...');
  }

  /**
   * Handle feedback action
   */
  private static handleFeedback(): void {
    // Could open a feedback form or mailto link
    window.open('mailto:feedback@lovpen.com?subject=内测申请反馈');
  }

  /**
   * Handle existing email notification (409 conflict)
   */
  static generateExistingEmailNotification(
    waitlistInfo: WaitlistResponse,
    locale: string = 'zh'
  ): NotificationConfig {
    const normalizedLocale = locale?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    const { queue_position } = waitlistInfo;
    
    const messages = {
      zh: {
        title: '📧 邮箱已注册',
        message: queue_position 
          ? `该邮箱已在等候列表中（第 ${queue_position} 位）。我们会按顺序处理所有申请。`
          : '该邮箱已在等候列表中。我们会按顺序处理所有申请。'
      },
      en: {
        title: '📧 Email Already Registered',
        message: queue_position
          ? `This email is already on the waitlist (position #${queue_position}). We'll process all applications in order.`
          : 'This email is already on the waitlist. We\'ll process all applications in order.'
      }
    };

    const msg = messages[normalizedLocale as keyof typeof messages] || messages.zh;

    return {
      type: 'info',
      title: msg.title,
      message: msg.message,
      duration: 7000
    };
  }
}
