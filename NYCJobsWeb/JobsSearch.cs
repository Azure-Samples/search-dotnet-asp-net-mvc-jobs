using Azure;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Models;
using Microsoft.Spatial;
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
        private static SearchClient _indexClient;
        private static string IndexName = "nycjobs";
        private static SearchClient _indexZipClient;
        private static string IndexZipCodes = "zipcodes";

        public static string errorMessage;

        static JobsSearch()
        {
            try
            {
                string searchendpoint = ConfigurationManager.AppSettings["Searchendpoint"];
                string apiKey = ConfigurationManager.AppSettings["SearchServiceApiKey"];

                // Create an HTTP reference to the catalog index
                _indexClient = new SearchIndexClient(new Uri(searchendpoint), new AzureKeyCredential(apiKey)).GetSearchClient(IndexName); 
                _indexZipClient = new SearchIndexClient(new Uri(searchendpoint), new AzureKeyCredential(apiKey)).GetSearchClient(IndexZipCodes);

            }
            catch (Exception e)
            {
                errorMessage = e.Message.ToString();
            }
        }

        public SearchResults<SearchDocument> Search(string searchText, string businessTitleFacet, string postingTypeFacet, string salaryRangeFacet,
            string sortType, double lat, double lon, int currentPage, int maxDistance, string maxDistanceLat, string maxDistanceLon)
        {
            // Execute search based on query string
            try
            {
                SearchOptions sp = new SearchOptions()
                {
                    SearchMode = SearchMode.Any,
                    Size = 10,
                    Skip = currentPage - 1,
                    // Add count
                    IncludeTotalCount = true,
                    // Add search highlights
                    HighlightPreTag = "<b>",
                    HighlightPostTag = "</b>",
                };
                List < String > select = new List<String>() {"id", "agency", "posting_type", "num_of_positions", "business_title",
                        "salary_range_from", "salary_range_to", "salary_frequency", "work_location", "job_description",
                        "posting_date", "geo_location", "tags"};
                List<String> facets = new List<String>() { "business_title", "posting_type", "level", "salary_range_from,interval:50000" };
                AddList(sp.Select, select);
                AddList(sp.Facets, facets);
                sp.HighlightFields.Add("job_description");
               
                // Define the sort type
                if (sortType == "featured")
                {
                    sp.ScoringProfile = "jobsScoringFeatured";      // Use a scoring profile
                    sp.ScoringParameters.Add("featuredParam--featured");
                    sp.ScoringParameters.Add("mapCenterParam--"+ GeographyPoint.Create(lon, lat));
                }
                else if (sortType == "salaryDesc")
                    sp.OrderBy.Add("salary_range_from desc");
                else if (sortType == "salaryIncr")
                    sp.OrderBy.Add("salary_range_from");
                else if (sortType == "mostRecent")
                    sp.OrderBy.Add("posting_date desc");


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

                return _indexClient.Search<SearchDocument>(searchText, sp);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public SearchResults<SearchDocument> SearchZip(string zipCode)
        {
            // Execute search based on query string
            try
            {
                SearchOptions sp = new SearchOptions()
                {
                    SearchMode = SearchMode.All,
                    Size = 1,
                };
                return _indexZipClient.Search<SearchDocument>(zipCode, sp);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public SuggestResults<SearchDocument> Suggest(string searchText, bool fuzzy)
        {
            // Execute search based on query string
            try
            {
                SuggestOptions sp = new SuggestOptions()
                {
                    UseFuzzyMatching = fuzzy,
                    Size = 8
                };

                return _indexClient.Suggest<SearchDocument>(searchText, "sg", sp);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public SearchDocument LookUp(string id)
        {
            // Execute geo search based on query string
            try
            {
                return _indexClient.GetDocument<SearchDocument>(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
            }
            return null;
        }

        public void AddList(IList<string> list1, List<String> list2)
        {
            foreach(string element in list2)
            {
                list1.Add(element);
            }
        }
    }
}