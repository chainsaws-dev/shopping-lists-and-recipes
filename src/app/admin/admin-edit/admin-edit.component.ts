import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '../admin.service';
import { User } from '../admin.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {

  editmode: boolean;
  index: number;
  UserToEdit: User;

  constructor(
    private AdminServ: AdminService,
    private activatedroute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      (params: Params) => {
        this.editmode = params.id != null;
        if (this.editmode) {
          this.index = +params.id;
          this.UserToEdit = this.AdminServ.GetUserById(this.index);
        } else {
          this.UserToEdit = new User('guest_role_read_only', '', '', '');
        }
        this.AdminServ.CurrentSelectedItem = this.UserToEdit;
      }
    );
  }

  OnSaveClick(SubmittedForm: NgForm) {
    if (SubmittedForm.valid) {
      this.router.navigate(['../'], { relativeTo: this.activatedroute, queryParamsHandling: 'merge' });
    }
  }
}


