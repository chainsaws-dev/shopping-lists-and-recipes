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

  changepassword: boolean;

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

      this.UserToEdit.Email = SubmittedForm.value.useremail;
      this.UserToEdit.Name = SubmittedForm.value.username;
      this.UserToEdit.Phone = SubmittedForm.value.userphone;
      this.UserToEdit.Role = SubmittedForm.value.roles;
      if (SubmittedForm.value.changepassword) {
        // Отправляем с новым паролем
        // SubmittedForm.value.newpassword
      } else {

      }

      // this.datastore.SaveRecipe(this.UserToEdit);

      /*
      this.DatabaseUpdated = this.datastore.RecipesUpdateInsert.subscribe((user) => {

        if (this.editmode) {
          this.UserToEdit = user;
          this.recipeservice.UpdateExistingRecipe(this.UserToEdit, this.index);
        } else {
          this.UserToEdit = user;
          this.recipeservice.AddNewRecipe(this.UserToEdit);
        }
        this.router.navigate(['../'], { relativeTo: this.activatedroute, queryParamsHandling: 'merge' });
      });
      */
    }
  }

}


