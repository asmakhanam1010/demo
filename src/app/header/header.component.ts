import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails: any = JSON.parse(localStorage.getItem('userDetails'));
  profileDropdown: boolean = false;
  @Input() userName!: string;
  constructor() { }

  ngOnInit(): void {
    this.userName = this.userDetails.firstName;
  }

}
