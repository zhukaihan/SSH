# SSH
# SSH README


## Introduction: 
## Table of Contents
1. [Overview](#Overview)
2. [Product Specifications](#Product-Specifications)
3. [Wireframes](#Digital-Wireframes)
## Overview 
### Description
Our development team is SSH, a project team for CSE 110 in Spring 2019. We are creating a React Native app named Student and Student Housing (SSH) that would help UCSD students find off-campus houses. The app will support functionalities such as finding roomates, searching for houses, posting housings, and messaging. The app will showcase similar information as Airbnb.

### App Evaluation
- **Category:** Service
- **Mobile:** This app would be developed for both android and IOS using Rect Native. 
- **Story:** The application allows you to create a user profile and start input the user's personalities. User Data is pushed to the application and processed into an easily digestible form for users.
- **Market:** UCSD students who have trouble finding, subleasing or renting houses.
- **Habit:** This app would ideally be used at least once a day
- **Scope:** TODO

### Team members

| Name                   | Role                      |
|------------------------|---------------------------|
| Alyssa Ramiro          | Project Manager           |
| Thomas Wan             | Business Analyst          |
| Brenna Dimalanta       | Senior Systems Analyst    |
| Kaihan “Peter” Zhu     | Software Architect        |
| Yu “Tim” Tai Wang      | Software Development Lead |
| Brian Wang             | Algorithm Specialist      |
| Yubo “Mark” Chen       | Database Specialist       |
| Jiaxuan Ren            | Database Specialist       |
| Yingjian “Patrick” Pei | Quality Assurance Lead    |
| Siqiao “Clark” Ruan    | User Interface Specialist |
| Weijin Xu              | User Interface Specialist |


## Product Specifications
### 1. User Stories

**Required Must-have Stories**

* User logs in to home page and other pertinent information
* User edits posts/roomates
* Application analyzes data and shows real time feedback
* Profile page 
* Settings (Accesibility, Notification, General, logout etc.)

**Optional Nice-to-have Stories**

* Messaging system

### 2. Screen Archetypes
* Login 
* Register 
* Profile Screen 
* Summary Screen
* Settings Screen

### 3. Navigation
## Dependencies 

### Basics: 
**Tab Navigation** (Tab to Screen)
**Flow Navigation** (Screen to Screen)
## Digital Wireframes
### [BONUS] Interactive Prototype

### 4. Models
**user object**

| Field                 | Type    | Description                                  |
|-----------------------|---------|----------------------------------------------|
| UserId                | String  | The unique ID of the user                    |
| FirstName             | String  | The first name of the user                   |
| LastName              | String  | The last name of the user                    |
| PreferredName         | String  | The preferred name of the user               |
| Gender                | String  | The gender of the user                       |
| Major                 | String  | The major of the user                        |
| YearInCollege         | String  | the number of years that user spends in UCSD |
| Interests and Hobbies | String  | The interests or hobbies that user have      |
| Description           | String  | a brief bio about the user                   |

### 5. Outline Network Requests
