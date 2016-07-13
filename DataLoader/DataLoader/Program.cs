// This is a prototype tool that allows for extraction of data from an Azure Search index
// Since this tool is still under development, it should not be used for production usage

using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AzureSearchBackupRestore
{
    class Program
    {
        private static string TargetSearchServiceName = [Target Search Service];
        private static string TargetAPIKey = [Target Search Service API Key];
        private static string TargetIndexName = [Target Index Name];

        private static SearchServiceClient TargetSearchClient;
        private static SearchIndexClient TargetIndexClient;

        static void Main(string[] args)
        {
            TargetSearchClient = new SearchServiceClient(TargetSearchServiceName, new SearchCredentials(TargetAPIKey));
            TargetIndexClient = TargetSearchClient.Indexes.GetClient(TargetIndexName);

            // Re-create and import content to target indexes
            LaunchImportProcess("zipcodes");
            LaunchImportProcess("nycjobs");
            
            Console.WriteLine("NOTE: For really large indexes it may take some time to index all content.\r\n");
            Console.WriteLine("Press any key to continue.\r\n");
            Console.ReadLine();
        }

        private static void LaunchImportProcess(string IndexName)
        {
            // Re-create and import content to target index
            TargetIndexName = IndexName;
            Console.WriteLine("Deleting " + TargetIndexName + " index...");
            DeleteIndex();
            Console.WriteLine("Creating " + TargetIndexName + " index...");
            CreateTargetIndex();
            Console.WriteLine("Uploading data to " + TargetIndexName + "...");
            ImportFromJSON();
        }

        private static bool DeleteIndex()
        {
            // Delete the index if it exists
            try
            {
                TargetSearchClient.Indexes.Delete(TargetIndexName);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error deleting index: {0}\r\n", ex.Message);
                Console.WriteLine("Did you remember to set your SearchServiceName and SearchServiceApiKey?\r\n");
                return false;
            }

            return true;
        }

        static void CreateTargetIndex()
        {
            // Use the schema file to create a copy of this index
            // I like using REST here since I can just take the response as-is

            string json = File.ReadAllText("..\\..\\..\\..\\NYCJobsWeb\\Schema_and_Data\\" + TargetIndexName + ".schema");

            // Do some cleaning of this file to change index name, etc
            json = "{" + json.Substring(json.IndexOf("\"name\""));
            int indexOfIndexName = json.IndexOf("\"",json.IndexOf("name\"")+5) + 1;
            int indexOfEndOfIndexName = json.IndexOf("\"",indexOfIndexName);
            json = json.Substring(0, indexOfIndexName) + TargetIndexName + json.Substring(indexOfEndOfIndexName);

            Uri ServiceUri = new Uri("https://" + TargetSearchServiceName + ".search.windows.net");
            HttpClient HttpClient = new HttpClient();
            HttpClient.DefaultRequestHeaders.Add("api-key", TargetAPIKey);

            try
            {
                Uri uri = new Uri(ServiceUri, "/indexes");
                HttpResponseMessage response = AzureSearchHelper.SendSearchRequest(HttpClient, HttpMethod.Post, uri, json);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: {0}", ex.Message.ToString());
            }

        }

        static void ImportFromJSON()
        {
            // Take JSON file and import this as-is to target index
            Uri ServiceUri = new Uri("https://" + TargetSearchServiceName + ".search.windows.net");
            HttpClient HttpClient = new HttpClient();
            HttpClient.DefaultRequestHeaders.Add("api-key", TargetAPIKey);

            try
            {
                foreach (string fileName in Directory.GetFiles("..\\..\\..\\..\\NYCJobsWeb\\Schema_and_Data\\", TargetIndexName + "*.json"))
                {
                    Console.WriteLine("Uploading documents from file {0}", fileName);
                    string json = File.ReadAllText(fileName);
                    Uri uri = new Uri(ServiceUri, "/indexes/"+ TargetIndexName + "/docs/index");
                    HttpResponseMessage response = AzureSearchHelper.SendSearchRequest(HttpClient, HttpMethod.Post, uri, json);
                    response.EnsureSuccessStatusCode();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: {0}", ex.Message.ToString());
            }
        }
    }
}
