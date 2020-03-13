using Microsoft.Azure.Search.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NYCJobsWeb.Models
{
    public class NYCJob
    {
        public IDictionary<string, IList<FacetResult>> Facets { get; set; }
        public IList<SearchResult<Document>> Results { get; set; }
        public int? Count { get; set; }
    }

    public class NYCJobLookup
    {
        public Document Result { get; set; }
    }

}