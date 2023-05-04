import { Component, OnInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { Photo } from 'src/app/_modules/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photos-management',
  templateUrl: './photos-management.component.html',
  styleUrls: ['./photos-management.component.css']
})
export class PhotosManagementComponent implements OnInit {
photos: Photo[] =[];

 constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe({
    next: photos => this.photos = photos
    })
  }

  approvePhoto(photoId: number){
    this.adminService.approvePhoto(photoId).subscribe(
      {
        next: () => this.photos.splice(this.photos.findIndex(p => p.id == photoId),1)
      }
    )
  }


  rejectPhoto(photoId: number){
    this.adminService.rejectPhoto(photoId).subscribe({
      next: () => this.photos.splice(this.photos.findIndex(p => p.id == photoId),1)
    })
  }
}
