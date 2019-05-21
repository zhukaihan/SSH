# SSH README


## Introduction: 
## Table of Contents
1. [Overview](#Overview)
2. [Product Specifications](#Product-Specifications)
3. [Wireframes](#Digital-Wireframes)
4. [Installation](#Installation)
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

**Optional Should-have Stories**

**Absolutely Won't-have Stories**

* Messaging system

### 2. Screen Archetypes
* Login 
* Register 
* Profile Screen 
* Summary Screen
* Settings Screen

### 3. Navigation

**Tab Navigation** (Tab to Screen)
**Flow Navigation** (Screen to Screen)


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

## Digital Wireframes
![Alt text](/img_assets/Wireframes.png?raw=true "Wireframes")
### [BONUS] Interactive Prototype


## Installation

### Fresh Installation: 
git pull everything in this repository. Then... 
```bash
rm -r node_modules
rm package-lock.json
npm install
```

You should be good to go. 

**The package.json has been tested to be issue-free.**
**After each pull, always reinstall**

### Installation Issues

**If any issue occurs, always try to remove node_modules and package-lock.json and npm install first.**
**If the issue does not resolve, try the following steps. The following steps would be the last you want to try.**

**DO NOT use npm install or npm remove individual components unless you are adding dependency to the project. Otherwise, it will break the package.json and leaves issues for others when they pulled.**

**The following steps should resolve installation issues 99% of the time.**

```bash
rm -r node_modules
rm package-lock.json
git pull
npm install
```

**Remove only node_modules is not enough, remove package-lock.json as well because package-lock.json is customized for individual devices.**

If this fails to resolve the issue, then follow the following steps. 

#### However, if you encountered the following issue: 

> Unable to resolve module 'react-native-keyboard-aware-scroll-view'

This is a new dependency. Be sure to remove node_modules and package-lock.json and npm install before using the following step. 

```bash
npm install --save react-native-keyboard-aware-scroll-view
```

#### However, if you encountered the following issue: 

You should not have this issue if you have removed both node_modules and package-lock.json before npm install. 

> Unable to resolve module 'react-native-gesture-handler'

```bash
npm install react-native-gesture-handler
```

Expo should already included react-native-gesture-handler. You can check this with: 

```bash
npm list react-native-gesture-handler
```

### However, if you encountered the following issue: 

The react-native-gesture-handler comes with expo. There should be no separate react-native-gesture-handler in your package.json. 
Otherwise, the following error will appear. This issue should not appear if you have the up-to-date package.json. 

> Tried to register two views with the same name RNGestureHandlerButton

```bash
rm -r node_modules
rm package-lock.json
git pull
npm install
```

If the issue persist, 

```bash
rm -r node_modules/expo/node_modules/react-native-gesture-handler
```
