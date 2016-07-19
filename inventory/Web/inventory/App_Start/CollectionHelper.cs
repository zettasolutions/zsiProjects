using System.Web;

using zsiInventory.Models;
using System.Data;
using System.Collections.Generic;
using System.ComponentModel;
using System;

namespace zsiInventory
{
    public class CollectionHelper
    {
        private CollectionHelper(){}

        public static DataTable toDataTable<T>(IList<T> list)
        {
            DataTable table = CreateTable<T>();
            Type entityType = typeof(T);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

            foreach (T item in list)
            {
                DataRow row = table.NewRow();

                foreach (PropertyDescriptor prop in properties)
                {
                    //row[prop.Name] = prop.GetValue(item);
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                }

                table.Rows.Add(row);
            }

            return table;
        }

        public static DataTable CreateTable<T>()
        {
            Type entityType = typeof(T);
            DataTable table = new DataTable(entityType.Name);
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

            foreach (PropertyDescriptor prop in properties)
            {
                // HERE IS WHERE THE ERROR IS THROWN FOR NULLABLE TYPES
                //table.Columns.Add(prop.Name, prop.PropertyType);
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }

            return table;
        }
    }
}
