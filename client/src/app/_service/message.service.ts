import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetPaginatedResult, GetPaginationHeaders } from '../_services/paginationHelper';
import { Message } from '../_modules/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
baseUrl = environment.apiUrl;
hubUrl = environment.hubUrl;
private hubConnection?: HubConnection;
private messageThreadSource = new BehaviorSubject<Message[]>([]);
messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }


  createHubConnection(user: User, otherUsername: string){
    console.log(user) 
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'message?user='+ otherUsername, {
      accessTokenFactory:() => user.token
    })
    .withAutomaticReconnect()
    .build();


    this.hubConnection.start().catch(error => console.log(error))

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages, message])
        }
      })
    })

  }



  stopHubConnection(){
    if(this.hubConnection)
    {
    this.hubConnection.stop();
    }
  }

  getMessages(pageNumber: number, pageSize:number, container: string){

    let params = GetPaginationHeaders(pageNumber,pageSize);
    params = params.append('Container',container); 

    return GetPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http)
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl +'messages/thread/' + username)
  }

  async sendMessage(username: string,content: string){
    //return this.http.post<Message>(this.baseUrl+ 'messages',{recipientUsername: username,content})
    //via HUB
    return this.hubConnection?.invoke('SendMessage', {recipienUsername: username, content})
    .catch(error => console.log("errorsending:" + error));
   
  }
   deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'messages/' + id)
   }
}
