import prompts from 'prompts';
import moment from 'moment';

class Alarm {
    time: string;
    dayOfWeek: string;
    isActive: boolean;
    isSnoozed: boolean;

    constructor(time: string, dayOfWeek: string) {
        this.time = time;
        this.dayOfWeek = dayOfWeek;
        this.isActive = true;
        this.isSnoozed = false;
    }

    triggerAlarm() {
        console.log(`Alarm ringing! It's ${this.time} on ${this.dayOfWeek}`);
    }

    snooze() {
        this.isSnoozed = true;
        console.log(`Alarm snoozed for 5 minutes.`);
    }
}

class AlarmClock {
    alarms: Alarm[] = [];

    displayCurrentTime() {
        const now = moment();
        console.log(`Current time: ${now.format('HH:mm:ss')} on ${now.format('dddd')}`);
    }

    createAlarm(time: string, dayOfWeek: string) {
        const newAlarm = new Alarm(time, dayOfWeek);
        this.alarms.push(newAlarm);
        console.log(`Alarm set for ${time} on ${dayOfWeek}`);
    }

    checkAlarms() {
        const now = moment();
        const currentTime = now.format('HH:mm:ss');
        const currentDay = now.format('dddd');

        this.alarms.forEach(alarm => {
            if (alarm.isActive && !alarm.isSnoozed && alarm.time === currentTime && alarm.dayOfWeek === currentDay) {
                alarm.triggerAlarm();
            } else if (alarm.isSnoozed) {
                const snoozedTime = moment().add(5, 'minutes').format('HH:mm:ss');

                if (snoozedTime === currentTime && alarm.dayOfWeek === currentDay) {
                    alarm.isSnoozed = false;
                    alarm.triggerAlarm();
                }
            }
        });
    }

    snoozeAlarm(time: string, dayOfWeek: string) {
        const alarm = this.alarms.find(alarm => alarm.time === time && alarm.dayOfWeek === dayOfWeek);
        if (alarm) {
            alarm.snooze();
        } else {
            console.log('No active alarm found at the specified time.');
        }
    }
}

const alarmClock = new AlarmClock();

async function mainMenu() {
    const response = await prompts({
        type: 'select',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            { title: 'Display current time', value: 'display-time' },
            { title: 'Set an alarm', value: 'set-alarm' },
            { title: 'Snooze an alarm', value: 'snooze-alarm' },
            { title: 'Check alarms', value: 'check-alarms' },
            { title: 'Exit', value: 'exit' },
        ],
    });

    switch (response.action) {
        case 'display-time':
            alarmClock.displayCurrentTime();
            break;
        case 'set-alarm':
            await setAlarm();
            break;
        case 'snooze-alarm':
            await snoozeAlarm();
            break;
        case 'check-alarms':
            alarmClock.checkAlarms();
            break;
        case 'exit':
            process.exit(0);
    }

    setTimeout(mainMenu, 1000);
}

async function setAlarm() {
    const response = await prompts([
        {
            type: 'text',
            name: 'time',
            message: 'Enter alarm time (HH:mm:ss):',
            validate: (input) => moment(input, 'HH:mm:ss', true).isValid() ? true : 'Invalid time format.'
        },
        {
            type: 'select',
            name: 'dayOfWeek',
            message: 'Select the day of the week:',
            choices: moment.weekdays().map(day => ({ title: day, value: day })),
        }
    ]);

    alarmClock.createAlarm(response.time, response.dayOfWeek);
}

async function snoozeAlarm() {
    const response = await prompts([
        {
            type: 'text',
            name: 'time',
            message: 'Enter the time of the alarm to snooze (HH:mm:ss):',
            validate: (input) => moment(input, 'HH:mm:ss', true).isValid() ? true : 'Invalid time format.'
        },
        {
            type: 'select',
            name: 'dayOfWeek',
            message: 'Select the day of the week:',
            choices: moment.weekdays().map(day => ({ title: day, value: day })),
        }
    ]);

    alarmClock.snoozeAlarm(response.time, response.dayOfWeek);
}

// Start the CLI application

function startAlarmChecker() {
    setInterval(() => {
        alarmClock.checkAlarms();
    }, 1000); // Check every second
}

// Start the CLI application
startAlarmChecker();
mainMenu();
