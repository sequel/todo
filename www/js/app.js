// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// angular.module('starter', ['ionic'])
angular.module('todo', ['ionic'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('Projects', () => {
  return {
    all: () => {
      const projectString = window.localStorage['projects'];
      if (projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },

    save: (projects) => window.localStorage['projects'] = angular.toJson(projects),

    newProject: (projectTitle) => {
      return {
        title: projectTitle,
        tasks: []
      };
    },

    getLastActiveIndex: () => {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },

    setLastActiveIndex: (index) => {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})


.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate){

  // A utility function for creating a new project
  // with the given projectTitle
  const createProject = (projectTitle) => {
    const newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }

  // Load or intialize projects
  $scope.projects = Projects.all();

  // Grab the Last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  // Called to create a new project
  $scope.newProject = () => {
    const projectTitle = prompt('Project name');
    if (projectTitle) {
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = (project, index) => {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', (modal) => $scope.taskModal = modal, {scope: $scope});

  $scope.createTask = (task) => {
    if(!$scope.activeProject || !task) return;
    
    $scope.activeProject.tasks.push({title: task.title});
    
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  $scope.newTask = () => $scope.taskModal.show();

  $scope.closeNewTask = () => $scope.taskModal.hide();

  $scope.toggleProjects = () => $ionicSideMenuDelegate.toggleLeft();

  // Try to create the first project, make sure to defer
  // this by using $timeout so everything is intialized
  // properly
  $timeout(() => {
    if ($scope.projects.length <= 0) {
      while (true) {
        const projectTitle = prompt('Your first project title:');
        if (projectTitle) {
          createProject(projectTitle);
          break;
        }
      }
    }
  }, 1000);

  // $scope.tasks = [
  //   { title: 'Collect coins' },
  //   { title: 'Eat mushrooms' },
  //   { title: 'Get high enough to grab the flag' },
  //   { title: 'Find the Princesss' },
  // ];

  // // Create and load the Modal
  // $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
  //   $scope.taskModal = modal;
  // }, {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // });

  // // Called when the form is submitted
  // $scope.createTask = function(task) {
  //   $scope.tasks.push({
  //     title: task.title
  //   });
  //   $scope.taskModal.hide();
  //   task.title = "";
  // };

  // // Open our new task modal
  // $scope.newTask = function() {
  //   $scope.taskModal.show();
  // };

  // // Close the new task modal
  // $scope.closeNewTask = function() {
  //   $scope.taskModal.hide();
  // };
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})
