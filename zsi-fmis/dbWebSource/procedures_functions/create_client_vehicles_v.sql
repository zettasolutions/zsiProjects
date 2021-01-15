
CREATE PROCEDURE [dbo].[create_client_vehicles_v] 
   @client_id int
AS
BEGIN  
   SET NOCOUNT ON;

   DECLARE @view_name VARCHAR(100);
   DECLARE @create_view_stmt NVARCHAR(max);


   SET @view_name = CONCAT('vehicles_',@client_id,'_v');
   
   SET @create_view_stmt = 'CREATE VIEW dbo.' + @view_name + 
                     + ' AS SELECT * FROM dbo.vehicles WHERE company_id=' + CAST(@client_id AS VARCHAR(20))
   EXEC(@create_view_stmt);
END;

--[dbo].[create_client_vehicles_v] @client_id=1

