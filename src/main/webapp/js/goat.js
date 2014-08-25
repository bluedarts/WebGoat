//main goat application file
//TODO: reorg

/* ### GOAT CONTROLLERS ### */

/** Menu Controller
 *  prepares and updates menu topic items for the view
 */
goat.controller('goatLesson', function($scope, $http, $modal, $log) {
    //TODO: implement via separate promise and use config for menu
    $http({method: 'GET', url: 'service/lessonmenu.mvc'}).then(
            function(menuData) {
                var menuItems = goat.addMenuClasses(goatConstants.menuPrefix.concat(menuData.data));
                $scope.menuTopics = menuItems;
            },
            function(error) {
                // TODO - handle this some way other than an alert
                console.error("Error rendering menu: " + error);
            }
    );
    $scope.renderLesson = function(url) {
        console.log(url + ' was passed in');
        // use jquery to render lesson content to div
        loadLessonContent(url).then(
                function(reply) {
                    $("#lesson_content").html(reply);
                    // hook forms
                    makeFormsAjax();
                    $('#lessonTitle').text(extractLessonTitle($(reply)));
                    // adjust menu to lessonContent size if necssary
                    if ($('div.panel-body').height() > 400) {
                        $('#leftside-navigation').height($(window).height());
                    }
                }
        );
        /*
         console.log("Updating Lesson Source...");
         $http.get('service/source.mvc').success(function(data) {
         $scope.lessonSource = data.source;
         }).error(function(data) {
         $scope.lessonSource = data.message;
         console.log("LessonSource = '" + data.message + "'");
         });
         */
    };
    /*
     * Function to load lesson source
     * @returns {undefined}
     */
    $scope.showSource = function(size) {
        // fetch source from web service
        $http.get('service/source.mvc').success(function(data) {
            $scope.lessonSource = data.source;
            $scope.openSourceModal(size);
        }).error(function(data) {
            $scope.lessonSource = data.message;
            console.log("LessonSource = '" + data.message + "'");
             $scope.openSourceModal(size);
        })

    }

    $scope.openSourceModal = function(size) {
        var modalInstance = $modal.open({
            templateUrl: 'showSource.html',
            controller: showSourceController,
            size: size,
            resolve: {
                lessonSource: function() {
                    return $scope.lessonSource;
                }
            }
        });
        modalInstance.result.then(function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

}).animation('.slideDown', function() {
    var NgHideClassName = 'ng-hide';
    return {
        beforeAddClass: function(element, className, done) {
            if (className === NgHideClassName) {
                $(element).slideUp(done);
            }
        },
        removeClass: function(element, className, done) {
            if (className === NgHideClassName) {
                $(element).hide().slideDown(done);
            }
        }
    }
});


//TODO add recursion to handle arr[i].children objects
// ... in case lower-level's need classes as well ... don't right now
goat.addMenuClasses = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        var menuItem = arr[i];
        //console.log(menuItem);
        if (menuItem.type && menuItem.type === 'CATEGORY') {
            menuItem.class = 'fa-angle-right pull-right';
        }
    }
    return arr;
};


/* ### GOAT DATA/PROMISES ### */


function loadLessonContent(_url) {
    //TODO: switch to $http (angular) later
    //return $http({method:'GET', url: _url});
    return $.get(_url, {}, null, "html");

}

function loadMenuData() {
    return $http({method: 'GET', url: 'service/lessonmenu.mvc'});
}

/* Controllers for modal instances */
var showSourceController = function($scope, $modalInstance, lessonSource) {

    $scope.lessonSource = lessonSource;

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};



