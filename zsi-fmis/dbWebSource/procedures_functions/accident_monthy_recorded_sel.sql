
CREATE PROCEDURE [dbo].[accident_monthy_recorded_sel]
(
      @client_id int 
	 ,@user_id int=NULL
)
AS
BEGIN
	
	DECLARE @stmt nvarchar(max)='';
	DECLARE @year INT;
	DECLARE @tbl nvarchar(30);
	SET @tbl = CONCAT('dbo.accident_transactions_',@client_id);
	SET @year = YEAR(DATEADD(HOUR,8,GETUTCDATE()));


	SET @stmt = CONCAT('SELECT MONTH(accident_date) accident_month,  COUNT(accident_id) total_accident FROM ',@tbl, 
						' WHERE  YEAR(accident_date)=',@year,
						' GROUP BY MONTH(accident_date)'); 

	EXEC(@stmt);
 END;

 --[dbo].[accident_monthy_recorded_sel] @client_id=1