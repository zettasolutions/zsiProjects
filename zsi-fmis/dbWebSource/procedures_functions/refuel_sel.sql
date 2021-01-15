
CREATE PROCEDURE [dbo].[refuel_sel]
(
    @user_id INT = NULL
   ,@doc_date    nvarchar(50)=null
   ,@gas_station_id int = null
   ,@vehicle_id  INT = null
   ,@search_val nvarchar(100)=null
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @client_id  INT;
    SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;
	SET @stmt = CONCAT('SELECT * FROM dbo.refuel_transactions_',@client_id,' WHERE 1=1 ');

	IF ISNULL(@doc_date,'') <> ''
	   SET @stmt = @stmt + ' AND doc_date =''' + @doc_date + '''';

	IF  ISNULL(@gas_station_id,0) <> 0
	    SET @stmt = @stmt + ' AND gas_station_id ='+ cast(@gas_station_id as varchar(20));

	IF  ISNULL(@vehicle_id,0) <> 0
	    SET @stmt = @stmt + ' AND vehicle_id ='+ cast(@vehicle_id as varchar(20));

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND doc_no like ''%' + @search_val  + '%'''


	exec(@stmt);
 END;

