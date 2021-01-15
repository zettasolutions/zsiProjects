CREATE PROCEDURE [dbo].[dtr_sel]
(
    @client_id int = null
   ,@start_date date=null
   ,@end_date date=null
   ,@search_val nvarchar(100)=null
   ,@user_id INT = NULL
   ,@col_no INT = 3
   ,@order_no INT = 0
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @order      VARCHAR(4000);
	DECLARE @sdate      DATE;
    DECLARE @edate      DATE;

 SET @stmt = CONCAT('SELECT d.*,e.employee_no, e.last_name, e.first_name,e.middle_name, e.name_suffix
	                    FROM dbo.dtr_',@client_id,' d INNER JOIN dbo.employees_',@client_id,'_v e ON d.employee_id = e.id  
	                    WHERE 1=1 ');

  
  
  SET @stmt = CONCAT(@stmt,' AND dtr_date between ''',@start_date,''' AND ''',@end_date,'''')
   

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND cast(employee_no as varchar(20)) like ''%' + @search_val  + '%'' or first_name like ''%' + @search_val  + '%'' or last_name like ''%' + @search_val  + '%'''

    print @stmt;
	exec(@stmt + ' order by dt_in');
 END;

 --[dbo].[dtr_sel] @client_id=0, @start_date='08/01/2020', @end_date = '08/11/2020'

