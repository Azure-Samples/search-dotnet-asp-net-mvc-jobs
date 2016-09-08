using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Web;

namespace NYCJobsWeb
{
    public class JobsSearch
    {
        private static SearchServiceClient _searchClient;
        private static SearchIndexClient _indexClient;
        private static string IndexName = "nycjobs";
        private static SearchIndexClient _indexZipClient;
        private static string IndexZipCodes = "zipcodes";

        public static string errorMessage;

        static JobsSearch()
        {
            try
            {
                string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
                string apiKey = ConfigurationManager.AppSettings["SearchServiceApiKey"];

                // Create an HTTP reference to the catalog index
                _searchClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));
                _indexClient = _searchClient.Indexes.GetClient(IndexName);
                _indexZipClient = _searchClient.Indexes.GetClient(IndexZipCodes);

            }
            catch (Exception e)
            {
                errorMessage = e.Message.ToString();
            }
        }

        public DocumentSearchResult Search(string searchText, string businessTitleFacet, string postingTypeFacet, string salaryRangeFacet,
            string sortType, double lat, double lon, int currentPage, int maxDistance, string maxDistanceLat, string maxDistanceLon)
        {
            // Execute search based on query string
            try
            {
                SearchParameters sp = new SearchParameters()
                {
                    SearchMode = SearchMode.Any,
                    Top = 10,
                    Skip = currentPage - 1,
                    // Limit results
                    Select = new List<String>() {"id", "agency", "posting_type", "num_of_positions", "business_title", 
                        "salary_range_from", "salary_range_to", "salary_frequency", "work_location", "job_description",
                        "posting_date", "geo_location", "tags"},
                    // Add count
                    IncludeTotalResultCount = true,
                    // Add search highlights
                    HighlightFields = new List<String>() { "job_description" },
                    HighlightPreTag = "<b>",
                    HighlightPostTag = "</b>",
                    // Add facets
                    Facets = new List<String>() { "business_title", "posting_type", "level", "salary_range_from,interval:50000" },
                };
                // Define the sort type
                if (sortType == "featured")
                {
                    sp.ScoringProfile = "jobsScoringFeatured";      // Use a scoring profile
                    sp.ScoringParameters = new List<ScoringParameter>();
                    sp.ScoringParameters.Add(new ScoringParameter("featuredParam", "featured"));
                    sp.ScoringParameters.Add(new ScoringParameter("mapCenterParam", lon.ToString(CultureInfo.InvariantCulture) + "," + lat.ToString(CultureInfo.InvariantCulture)));
                }
                else if (sortType == "salaryDesc")
                    sp.OrderBy = new List<String>() { "salary_range_from desc" };
                else if (sortType == "salaryIncr")
                    sp.OrderBy = new List<String>() { "salary_range_from" };
                else if (sortType == "mostRecent")
                    sp.OrderBy = new List<String>() { "posting_date desc" };


                // Add filtering
                string filter = null;
                if (businessTitleFacet != "")
                    filter = "business_title eq '" + businessTitleFacet + "'";
                if (postingTypeFacet != "")
                {
                    if (filter != null)
                        filter += " and ";
                    filter += "posting_type eq '" + postingTypeFacet + "'";

                }
                if (salaryRangeFacet != "")
                {
                    if (filter != null)
                        filter += " and ";
                    filter += "salary_range_from ge " + salaryRangeFacet + " and salary_range_from lt " + (Convert.ToInt32(salaryRangeFacet) + 50000).ToString();
                }

                if (maxDistance > 0)
                {
                    if (filter != null)
                        filter += " and ";
                    filter += "geo.distance(geo_location, geography'POINT(" + maxDistanceLon + " " + maxDistanceLat + ")') le " + maxDistance.ToString();
                }

                sp.Filter = filter;

                return _indexClient.Documents.Search(searchText, sp);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public DocumentSearchResult SearchZip(string zipCode)
        {
            // Execute search based on query string
            try
            {
                SearchParameters sp = new SearchParameters()
                {
                    SearchMode = SearchMode.All,
                    Top = 1,
                };
                return _indexZipClient.Documents.Search(zipCode, sp);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public DocumentSuggestResult Suggest(string searchText, bool fuzzy)
        {
            // Execute search based on query string
            try
            {
                SuggestParameters sp = new SuggestParameters()
                {
                    UseFuzzyMatching = fuzzy,
                    Top = 8
                };

                return _indexClient.Documents.Suggest(searchText, "sg", sp);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public Document LookUp(string id)
        {
            // Execute geo search based on query string
            try
            {
                return _indexClient.Documents.Get(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

    }
}