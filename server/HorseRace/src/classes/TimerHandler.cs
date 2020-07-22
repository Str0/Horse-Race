using System;
using System.Threading;

namespace util
{
    public class TimerHandler
    {
        private Timer timer {get ; set;}
        private Action callback  {get ; set;}

        public TimerHandler(Action callback, int milliseconds, int repeat = Timeout.Infinite)
        {
            this.callback = callback;

            this.timer = new Timer(
                new TimerCallback(TimerCallback),
                null,
                milliseconds,
                repeat);
        }

        public void stopTimeout()
        {
           timer.Change(Timeout.Infinite, Timeout.Infinite);
            
        }

        private void TimerCallback(object state)
        {
            this.callback();
            timer.Change(
                Timeout.Infinite,
                Timeout.Infinite);
        }

    }
}
