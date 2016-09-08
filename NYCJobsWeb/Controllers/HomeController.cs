using BingGeocoder;
using NYCJobsWeb.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NYCJobsWeb.Controllers
{
    public class HomeController : Controller
    {
        private JobsSearch _jobsSearch = new JobsSearch();

        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult JobDetails()
        {
            return View();
        }

        public ActionResult Search(string q = "", string businessTitleFacet = "", string postingTypeFacet = "", string salaryRangeFacet = "",
            string sortType = "", double lat = 40.736224, double lon = -73.99251, int currentPage = 0, int zipCode = 10001,
            int maxDistance = 0)
        {
            // If blank search, assume they want to search everything
            if (string.IsNullOrWhiteSpace(q))
                q = "*";

            string maxDistanceLat = string.Empty;
            string maxDistanceLon = string.Empty;

            //Do a search of the zip code index to get lat / long of this location
            //Eventually this should be extended to search beyond just zip (i.e. city)
            if (maxDistance > 0)
            {
                var zipReponse = _jobsSearch.SearchZip(zipCode.ToString());
                foreach (var result in zipReponse.Results)
                {
                    var doc = (dynamic)result.Document;
                    maxDistanceLat = Convert.ToString(doc["geo_location"].Latitude, CultureInfo.InvariantCulture);
                    maxDistanceLon = Convert.ToString(doc["geo_location"].Longitude, CultureInfo.InvariantCulture);
                }
            }

            var response = _jobsSearch.Search(q, businessTitleFacet, postingTypeFacet, salaryRangeFacet, sortType, lat, lon, currentPage, maxDistance, maxDistanceLat, maxDistanceLon);
            return new JsonResult
            {
                // ***************************************************************************************************************************
                // If you get an error here, make sure to check that you updated the SearchServiceName and SearchServiceApiKey in Web.config
                // ***************************************************************************************************************************

                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new NYCJob() { Results = response.Results, Facets = response.Facets, Count = Convert.ToInt32(response.Count) }
            };
        }

        [HttpGet]
        public ActionResult Suggest(string term, bool fuzzy = true)
        {
            // Call suggest query and return results
            var response = _jobsSearch.Suggest(term, fuzzy);
            List<string> suggestions = new List<string>();
            foreach (var result in response.Results)
            {
                suggestions.Add(result.Text);
            }

            return new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = suggestions
            };

        }

        public ActionResult LookUp(string id)
        {
            // Take a key ID and do a lookup to get the job details
            if (id != null)
            {
                var response = _jobsSearch.LookUp(id);
                return new JsonResult
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = new NYCJobLookup() { Result = response }
                };
            }
            else
            {
                return null;
            }

        }

    }
}
