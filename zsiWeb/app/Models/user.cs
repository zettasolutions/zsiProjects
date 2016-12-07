namespace zsi.web.Models
{
    using System;
    using System.Data;
    using System.Data.SqlClient;
    public class user {
        public int userId { get; set; }
        public string userName { get; set; }
        public int roleId { get; set; }
        public string isAdmin { get; set; }
        public string userFullName { get; set; }
        public string password { get; set; }

        public SqlDataReader SqlDataReader
        {
            set
            {
                SqlDataReader reader = value;
                if (reader["user_id"] != DBNull.Value)
                {
                    this.userId = (int)reader["user_id"];
                }
                if (reader["logon"] != DBNull.Value)
                {
                    this.userName = (string)reader["logon"];
                }
                if (reader["role_id"] != DBNull.Value)
                {
                    this.roleId = (int)reader["role_id"];
                }
                if (reader["is_admin"] != DBNull.Value)
                {
                    this.isAdmin = (string)reader["is_admin"];
                }
                if (reader["userFullName"] != DBNull.Value)
                {
                    this.userFullName = (string)reader["userFullName"];
                }
                if (reader["password"] != DBNull.Value)
                {
                    this.password = (string)reader["password"];
                }
            }
        }
    }

    public class dcUser: user
    {
        public dcUser() { }
        public dcUser(SqlDataReader reader)
        {
            this.SqlDataReader = reader;
        }
        public user getUserInfo(string userName)
        {
            try
            {
                SqlConnection dbConn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand command = new SqlCommand("users_sel", dbConn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@logon", userName);
                dbConn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                user _info = new user();
                while (reader.Read())
                {
                    _info.SqlDataReader = reader;
                }
                reader.Close();
                dbConn.Close();
                return _info;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void changePassword(string newPassword)
        {
            try
            {
                SqlConnection dbConn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand command = new SqlCommand("dbo.users_change_pwd_upd", dbConn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@user_id", SessionHandler.CurrentUser.userId);
                command.Parameters.AddWithValue("@password", newPassword);
                dbConn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                user _info = new user();
                while (reader.Read())
                {
                    _info.SqlDataReader = reader;
                }
                reader.Close();
                dbConn.Close();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public user getUserInfo(string userName, string password)
        {
            try
            {
                SqlConnection dbConn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand command = new SqlCommand("users_sel", dbConn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@logon", userName);
                command.Parameters.AddWithValue("@password", password);
                dbConn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                user _info = new user();
                while (reader.Read())
                {
                    _info.SqlDataReader = reader;
                }
                reader.Close();
                dbConn.Close();
                return _info;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }
}



