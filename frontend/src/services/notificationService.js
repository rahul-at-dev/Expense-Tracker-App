class NotificationService {
  async requestPermission() {
    if (!("Notification" in window)) {
      console.log("Browser doesn't support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return false
  }

  show(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/vite.svg"
      })
    }
  }

  budgetAlert(percent) {
    this.show(
      "💰 Budget Alert",
      `You have used ${percent}% of your monthly budget.`
    )
  }

  dailyReminder() {
    this.show(
      "📝 Expense Reminder",
      "Don't forget to record today's expenses."
    )
  }
  
  monthlyReminder() {
    this.show(
      "📊 Budget Reminder",
      "Set your budget for this month."
    )
  }
  checkDailyReminder() {
  const now = new Date()

  const currentHour = now.getHours()

  const today =
    now.toISOString().split('T')[0]

  const lastReminder =
    localStorage.getItem(
      'daily-reminder-date'
    )

  if (
    currentHour >= 21 &&
    lastReminder !== today
  ) {
    this.dailyReminder()

    localStorage.setItem(
      'daily-reminder-date',
      today
    )
  }
}
}

export default new NotificationService()
