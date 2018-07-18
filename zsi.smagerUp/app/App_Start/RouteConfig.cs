using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace zsi.smagerUp
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "get-page",
                url: "page/{pageName}",
                defaults: new { controller = "page", action = "name" }
                ,constraints: new { httpMethod = new HttpMethodConstraint(new string[] { "GET" }) }

            );


            routes.MapRoute(
                name: "get-public-page",
                url: "public/{pageName}",
                defaults: new { controller = "public", action = "name" }
                , constraints: new { httpMethod = new HttpMethodConstraint(new string[] { "GET" }) }
            );

            routes.MapRoute(
                name: "get-javascript-source",
                url: "javascript/{pageName}",
                defaults: new { controller = "javascript", action = "name" }
                ,constraints: new { httpMethod = new HttpMethodConstraint(new string[] { "GET" }) }

            );

            routes.MapRoute(
                name: "get-selectoption",
                url: "selectOption/code/{param1}/{param2}",
                defaults: new { controller = "selectOption", action = "code", param1 = UrlParameter.Optional, param2 = UrlParameter.Optional }
                ,constraints: new { httpMethod = new HttpMethodConstraint(new string[] { "GET" }) }

            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{pageName}",
                defaults: new { controller = "Home",action = "Index", pageName = UrlParameter.Optional }
            );


        }
    }
}
