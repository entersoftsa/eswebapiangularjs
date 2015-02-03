# eswebapiangularjs
This is an AngularJS library that encapsulates the functionality and services provided by the Entersoft Application Server WEB API.

## module es.Services.Web

documentation pending...

## module es.Services.Social

documentation pending...

## module es.Services.Analytics

documentation pending...

## module es.Services.Web.Environment

Provides environment mutators and related configuration. Check examples below,

#### Setting stage information during app config phase

The Environment module allows early configuration within angular's config block.

```
app.config(['EnvironmentProvider', function (environmentProvider) {
    environmentProvider.setStage('dev') //manually set stage
    environmentProvider.getStage() // 'dev'
}]);
```

You can also allow automatic environment detection by passing domain configuration.
```
app.config(['EnvironmentProvider', function (EnvironmentProvider) {
            EnvironmentProvider
            .addDevelopmentDomains([
                'gdm.dev.entersoft.gr'
            ])
            .addProductionDomains([
                'kbase.azurewebsites.net'
            ]);

        //try to detect stage from domain
        EnvironmentProvider.setStageFromDomain();

        EnvironmentProvider.getStage() // logs 'prod' assuming the app is running under 'kbase.azurewebsites.net'
}]);
```

#### Injected instance during app runtime
Once configured the Environment Provider returns an object with the following methods

* environment.isDev()
* environment.isProd()
* environment.isStaging()
* environment.getAssetsPath()
* environment.getTemplatesPath()
