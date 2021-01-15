
CREATE PROCEDURE [dbo].[refuel_monthy_exp_sel]
(
      @client_id int 
	 ,@user_id int=NULL
)
AS
BEGIN
	
	DECLARE @stmt nvarchar(max)='';
	DECLARE @year INT;
	DECLARE @tbl nvarchar(30);
	SET @tbl = CONCAT('dbo.refuel_transactions_',@client_id);
	SET @year = YEAR(DATEADD(HOUR,8,GETUTCDATE()));


	SET @stmt = CONCAT('SELECT MONTH(doc_date) refuel_month,  SUM(refuel_amount) total_refuel FROM ',@tbl, 
						' WHERE  YEAR(doc_date)=',@year,
						' GROUP BY MONTH(doc_date)'); 

	EXEC(@stmt);
 END;

 --[dbo].[refuel_monthy_exp_sel] @client_id=1