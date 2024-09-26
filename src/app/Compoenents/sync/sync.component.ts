import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsynService } from '../../Core/service/asyn.service';
declare var bootstrap: any;
@Component({
  selector: 'app-sync',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sync.component.html',
  styleUrl: './sync.component.scss'
})
export class SyncComponent {



  syncData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];
  pageSize = 10;
  editmelie!: FormGroup;

  meilForm = new FormGroup({
    label: new FormControl(null, Validators.required),
    sourceId: new FormControl(null, Validators.required),
    meiliSearchId: new FormControl(null, Validators.required),
  });

  constructor(private _AsynService:AsynService  ) {}

  ngOnInit(): void {
    this.getData(this.currentPage);
  }

  // Fetch paginated data
  getData(pageNumber: number = 1) {
    this._AsynService.getAll(pageNumber, this.pageSize).subscribe({
      next: (res) => {
        this.syncData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        console.log(res)
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  // Initialize form for editing


  // Handle form submission to add a new MeiliSearch instance

  // Delete a MeiliSearch instance
  deleteaync(id: string) {
    this._AsynService.deleteSync(id).subscribe({
      next: (res) => {
        console.log('Item deleted:', res);
        this.getData(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      }
    });
  }

  // Change pagination page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  // Close the modal
  closeModal() {
    const modalElement = document.querySelector('#exampleModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

  }
}
