export default class AnalyticsEvent {
  constructor(data) {
    this.hitType = data.hitType || 'event';
    this.eventCategory = data.eventCategory || '';
    this.eventAction = data.eventAction || '';
    if (data.eventLabel) {
      this.eventLabel = data.eventLabel;
    }
    if (data.eventValue) {
      this.eventValue = data.eventValue;
    }
  }
}
