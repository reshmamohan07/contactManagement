import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MyContact } from '../models/myContact';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact-manager',
  templateUrl: './contact-manager.component.html',
  styleUrls: ['./contact-manager.component.scss'],
})
export class ContactManagerComponent implements OnInit {
  public loading: boolean = false;
  public contacts: MyContact[] = [];
  public errorMessage: string | null = null;
  searchForm!: FormGroup;
  constructor(private contService: ContactService) {}

  ngOnInit(): void {
      this.searchForm = new FormGroup({
      searchInput: new FormControl(''),
    });

    this.getAllContactData();
  }
  getAllContactData() {
    this.loading = true;
    this.contService.getAllContacts().subscribe(
      (data: MyContact[]) => {
        this.loading = false;
        this.filterSearchData(data);
      },
      (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }

  searchItem() {
    console.log('hello');
    this.getAllContactData();
  }

  filterSearchData(data: MyContact[]) {
    const filterInput = this.searchForm.get('searchInput')?.value;
    this.contacts = data.filter(
      item =>
        !filterInput ||
        item.name.toLowerCase()?.includes(filterInput.toLowerCase()) ||
        item.mobile == filterInput ||
        item.email?.toLowerCase().includes(filterInput.toLowerCase())
    );
  }

  deleteContact(contactId: string | undefined) {
    if (contactId) {
      this.contService.deleteContacts(contactId).subscribe(
        (data: {}) => {
          this.getAllContactData();
        },
        (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      );
    }
  }
}
