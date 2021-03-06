app.controller('ExtraUpdaterCtrl', function($window, $scope, $rootScope, $pusher, $route, MenuUpdaterService, $http, blockUI) {
    blockUI.start();

    // Dynamic subtitle
    $('#logo-subtitle').text('EXTRAS UPDATER');

    MenuUpdaterService.getExtras().success(function(data) {

        if (data.success == true) {
            $rootScope.menu = data.message;
        } else {
            $rootScope.menu = [];
        }

        blockUI.stop();

        $scope.pizza = {};


        // Initiate collapsible element
        $('.collapsible').collapsible({
            accordion: true
        });

        // Open modal
        $scope.openAddModal = function(type) {
            if (type == 'mobile') {
                $('#add-item-mobile-modal').openModal();
            } else {
                $('#add-item-modal').openModal();
            }

            $('.tooltipped').tooltip({
                delay: 50
            });

            // Size dropdown datas
            $scope.sizes = [{
                id: 1,
                label: 'SMALL',
                name: 'small'
            }, {
                id: 2,
                label: 'REGULAR',
                name: 'regular'
            }, {
                id: 3,
                label: 'LARGE',
                name: 'large'
            }];

            // Crust dropdown datas
            $scope.crusts = [{
                id: 1,
                label: 'THIN',
                name: 'thin'
            }, {
                id: 2,
                label: 'THICK',
                name: 'thick'
            }, {
                id: 3,
                label: 'MEDIUM',
                name: 'medium'
            }, {
                id: 4,
                label: 'SOFT',
                name: 'soft'
            }, {
                id: 5,
                label: 'CRACKER',
                name: 'cracker'
            }];

            // Ingredients dropdown datas
            $scope.ingredients = [{
                id: 1,
                label: 'ONIONS',
                name: 'onions'
            }, {
                id: 2,
                label: 'PARSLEY',
                name: 'parsley'
            }, {
                id: 3,
                label: 'SALAMI',
                name: 'salami'
            }, {
                id: 4,
                label: 'TOMATOES',
                name: 'tomatoes'
            }, {
                id: 5,
                label: 'TUNA',
                name: 'tuna'
            }, {
                id: 6,
                label: 'BBQ SAUCE',
                name: 'bbq_sauce'
            }, {
                id: 7,
                label: 'BLACK OLIVE',
                name: 'black_olive'
            }, {
                id: 8,
                label: 'GARLIC CLOVES',
                name: 'garlic_cloves'
            }, {
                id: 9,
                label: 'MOZARELLA CHEESE',
                name: 'mozarella_cheese'
            }, {
                id: 10,
                label: 'OREGANO',
                name: 'oregano'
            }, {
                id: 11,
                label: 'PINEAPPLE',
                name: 'pineapple'
            }, {
                id: 12,
                label: 'CORN',
                name: 'corn'
            }, {
                id: 13,
                label: 'HAM',
                name: 'ham'
            }, {
                id: 14,
                label: 'JALAPENO',
                name: 'jalapeno'
            }];
        };

        $scope.closeAddModal = function() {
            $('#add-item-modal').closeModal();
        }

        $scope.$on("cropme:loaded", function(ev, width, height, cropmeEl) {
            blockUI.start();
            // Get the right image ratio (0.62:1)
            var ratio = width / height;
            if (ratio != 0.6153846153846154) {
                $scope.$broadcast("cropme:cancel");
                blockUI.stop();
                Materialize.toast('FAILED! Image ratio must be 0.62:1 (ex. 800p X 1300p)', 5000);
            }
            blockUI.stop();
        });

        // Open details modal
        $scope.details = function(id) {
            $('#details_' + id).openModal();
        };

        // Save new item
        $scope.save = function(pizza) {
            // Get uploaded image state
            var imageData = $("cropme").find('.responsive-img').attr('ng-src');
            if (imageData == undefined || !imageData) {
                var image = undefined;
            } else {
                var image = $("cropme").find('.responsive-img').attr('src');
            }

            // get upload link
            var url = MenuUpdaterService.getUploadLink();

            // Handle the form submission...
            master = angular.copy(pizza);

            // Form Validation !!!
            if (master.name == undefined) {
                blockUI.stop();
                Materialize.toast('Please enter NAME!', 5000);
                $('name').focus();
            } else if (master.price == undefined) {
                blockUI.stop();
                Materialize.toast('Please set PRICE!', 5000);
            } else if (master.description == undefined) {
                blockUI.stop();
                Materialize.toast('Please fill in DESCRIPTION!', 5000);
            } else if (master.crust == undefined) {
                blockUI.stop();
                Materialize.toast('You have to provide CRUSTS!', 5000);
            } else if (master.ingredient == undefined) {
                blockUI.stop();
                Materialize.toast('You have to provide INGREDIENTS!', 5000);
            } else if (master.size == undefined) {
                blockUI.stop();
                Materialize.toast('Please choose SIZES', 5000);
            } else if (image == undefined) {
                blockUI.stop();
                Materialize.toast('The pizza needs an IMAGE!', 5000);
            } else {
                // close the modal
                $scope.closeAddModal();

                blockUI.start();

                datas = {
                    name: master.name,
                    sizes: master.size,
                    crusts: master.crust,
                    ingredients: master.ingredient,
                    description: master.description,
                    price: master.price,
                    image: image
                };

                // send to server
                $http.post(url, datas).then(function(response) {
                    var string = response.message;
                    if (response.success == true) {

                        // reload items on menu
                        MenuUpdaterService.getExtras().success(function(data) {
                            if (data.success == true) {
                                $rootScope.menu = data.message;
                            } else {
                                $rootScope.menu = [];
                            }
                            Materialize.toast(string, 5000);
                            blockUI.stop();
                        });
                    } else {
                        Materialize.toast(string, 5000);
                        blockUI.stop();
                    }
                });
            };
        };

        // Confirm deleting
        $scope.confirm = function(id) {
            $('#confirm_' + id).openModal();
        };

        // delete pizza item
        $scope.delete = function(id) {
            blockUI.start();
            MenuUpdaterService.deletePizza(id).success(function(data) {
                if (data.success == false) {
                    Materialize.toast(data.message, 5000);
                } else {
                    // reload items on menu
                    MenuUpdaterService.getExtras().success(function(data) {
                        if (data.success == true) {
                            $rootScope.menu = data.message;
                        } else {
                            $rootScope.menu = [];
                        }
                        Materialize.toast("Pizza item has successfully deleted.", 5000);
                        blockUI.stop();
                    })
                }
            })
        };

        // publish/un-publish pizza item
        $scope.publish = function(id) {
            blockUI.start();
            MenuUpdaterService.publishPizza(id).success(function(response) {
                if (response.success == false) {
                    Materialize.toast(response.message, 5000);
                } else {
                    // reload items on menu
                    MenuUpdaterService.getExtras().success(function(data) {
                        if (data.success == true) {
                            $rootScope.menu = data.message;
                        } else {
                            $rootScope.menu = [];
                        }
                        Materialize.toast(response.message, 5000);
                        blockUI.stop();
                    })
                }
            })
        };

        // release new menu
        $scope.release = function() {
            Materialize.toast("Not ready yet!", 5000);
            MenuUpdaterService.releaseMenu().success(function(response) {
                // response
            })
        };

        // Open ingredients list modals
        $scope.openIngredientsModal = function() {
            $('#ingredients-modal').openModal();

            blockUI.start();

            MenuUpdaterService.getIngredients().success(function(data) {
                if (data.success == true) {
                    $rootScope.ingredients = data.message;
                } else {
                    $rootScope.ingredients = [];
                }

                blockUI.stop();
            });
        };

        // open add ingredient modal
        $scope.openAddIngredient = function() {
            $('#ingredients-modal').closeModal();
            $('#add-ingredients-modal').openModal();

            $scope.$watch('ingredient.name', function() {
                $scope.label = $scope.ingredient.name.toLowerCase().replace(/\s+/g, '-');
            });

            // image upload
            $scope.ingImage = '';
            $scope.ingCroppedImage = '';

            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function(evt) {
                    $scope.$apply(function($scope) {
                        $scope.ingImage = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            };

            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

            // save ingredient data
            $scope.saveIngredients = function(ingredient) {
                console.log('test');
                // Handle the form submission...
                master = angular.copy(ingredient);
                console.log("Going to send:", master);
            };
        };

        // close add ingredient modal
        $scope.closeAddIngredient = function() {
            $('#add-ingredients-modal').closeModal();
            $scope.openIngredientsModal();
        };

        // Refresh page
        $scope.refresh = function($route) {
            //$state.reload();
            $window.location.reload();
        };

    });
});
