import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { interval, map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  subscription!: Subscription;
  clickCount = signal<number>(0)
  interval = signal(0);
  clickCount$ = toObservable(this.clickCount);

  doubleInterval = computed(() => this.interval() * 2 )

  customInterval$ = new Observable(subscriber => {
   const internalSubscription = setInterval(() => {
      let timeExecuted = 0;
      if (timeExecuted > 5) {
        clearInterval(internalSubscription);
        subscriber.complete();
        return;
      }
      console.log('Emitting new value...');
      subscriber.next({message: 'New value'});    
      timeExecuted++;  
    }, 2000);
  });

  constructor(){
    // effect(() => {
    //   console.log(`Clicked button ${this.clickCount()} times`);
    // })
  }

  ngOnInit(): void {
    this.subscription = this.customInterval$.subscribe({
      next: (val) => console.log(val)      
    })
  // this.subscription = this.clickCount$.subscribe({
  //     next: () => console.log(`Clicked button ${this.clickCount()} times.`)
  //   })
  }
  
  onClick(){
    // this.clickCount.update(prevCount => prevCount + 1)
    this.subscription.unsubscribe();
  }

  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }

}
