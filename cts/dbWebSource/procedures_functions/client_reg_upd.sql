
CREATE PROCEDURE [dbo].[client_reg_upd] (
  @client_name    nvarchar(100)
 ,@country_code   nvarchar(50) = null
 ,@state_code     nvarchar(50) = null
 ,@city_code      nvarchar(50) = null
 ,@address        nvarchar(500)
 ,@client_number  nvarchar(100)
 ,@client_logo    image = null
 ,@parent_client_id int = null
 ,@style_css       nvarchar(max)=null
 ,@contact_name    nvarchar(50)
 ,@mobile_no       nvarchar(50)
 ,@user_id         int=null
)
as
BEGIN
  SET NOCOUNT ON
  DECLARE @id int
  INSERT INTO dbo.clients(
   client_name 
  ,country_code
  ,state_code  
  ,city_code   
  ,address     
  ,client_number
  ,client_logo
  ,parent_client_id
  ,style_css
  ,contact_name 
  ,mobile_no
  ,created_by
  ,created_date
  )
   VALUES 
  ( @client_name 
   ,@country_code
   ,@state_code  
   ,@city_code   
   ,@address     
   ,@client_number
   ,@client_logo
   ,@parent_client_id
   ,@style_css
   ,@contact_name
   ,@mobile_no
   ,@user_id
   ,GETDATE()
  )
  SET @id = @@IDENTITY
  INSERT INTO dbo.processes (seq_no, client_id, icon, process_title,is_default,is_active,created_date) 
                     VALUES (1,@id,'plus','Compose','Y','Y',GETDATE())


  RETURN @id
END