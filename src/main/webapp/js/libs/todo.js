var module = angular.module("todo", []);
module.factory('todoStore', function ($http, $waitDialog) {

    function read() {
        $waitDialog.show();
        return $http({
            method:'GET',
            url:'rest/todos'
        }).then(function (response) {
                $waitDialog.hide();
				localStorage.setItem("todos", JSON.stringify(response.data));
                return response.data;
            },
			function (error) {
            	 $waitDialog.hide();
            	
	              return JSON.parse(localStorage.getItem("todos"));
	            }
);
    }

	 function storeTodo(data) {
	        $waitDialog.show();
	        return $http({
	            method:'POST',
	            url:'rest/todos',
				data: data
	        }).then(function (response) {
	                $waitDialog.hide();
				
	            }
	);
	    }
	 
	 function removeTodo(data) {
	        $waitDialog.show();
	        return $http({
	            method:'DELETE',
	            url:'rest/todos/' + data
	        }).then(function (response) {
	                $waitDialog.hide();
				
	            }
	);
	    }

  

    return {
        read:read,
        storeTodo:storeTodo,
        removeTodo:removeTodo
    }
});

module.controller('TodoController', function ($scope, $navigate, todoStore) {
    $scope.todos = [];
    $scope.inputText = '';
    $scope.online = 'true';
    $scope.addTodo = function () {
    	todoStore.storeTodo({name:$scope.inputText, done:false}).then($scope.refreshTodos);
    	//$scope.todos.push({name:$scope.inputText, done:false});
        $scope.inputText = '';
        
    };
    $scope.showSettings = function () {
        $navigate("#settings");
    };
    $scope.back = function () {
        $navigate('back');
    };
    $scope.refreshTodos = function () {
        todoStore.read().then(function (data) {
            if (!data) {
                data = [];
            }
            $scope.todos = data;
        });
    };
    
    $scope.updateTodo = function(todo) {
    	todoStore.removeTodo(todo.id).then($scope.refreshTodos);
    };
   

    $scope.refreshTodos();
});