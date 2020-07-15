import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  id: number =  parseInt(localStorage.getItem('id'));
  constructor() { }

  ngOnInit(): void {
    if(!this.id){
      console.log('this.id', this.id);
      this.id = 0;
    }
  }
}
