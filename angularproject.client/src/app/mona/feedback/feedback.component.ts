import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

interface Feedback {
  id: string;
  Content: string;
  Name: string;
  Email: string;
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {


  feedbackList: Feedback[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getFeedbacks();
  }

  getFeedbacks(): void {
    this.http.get<Feedback[]>('https://67e2c65297fc65f53537891e.mockapi.io/Feedback')
      .subscribe(data => this.feedbackList = data);
  }

  addToTestimonials(feedback: Feedback): void {
    Swal.fire({
      title: 'Add to Testimonials?',
      text: `Are you sure you want to add "${feedback.Name}" to testimonials?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E72463',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, add it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post('https://67e2c65297fc65f53537891e.mockapi.io/Testimonial', feedback)
          .subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: 'Successfully added to testimonials.',
              timer: 2000,
              showConfirmButton: false
            });
          });
      }
    });
  }

}

