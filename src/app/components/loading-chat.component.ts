import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-chat',
  template: `
      <div class="min-vh-100 d-flex justify-content-center align-items-center">

          <div class="col-lg-6 col-sm-8">

              <div class="text-center">
                  <div class="spinner-border my-2"></div>
              </div>

              <div class="text-muted text-center ff-satoshi fw-500">
                  <p>Searching for your partner…<br/>
                      This can take a few seconds. Don’t close this window.</p>
              </div>
              
          </div>
      </div>
  `,
})
export class LoadingChatComponent {}
