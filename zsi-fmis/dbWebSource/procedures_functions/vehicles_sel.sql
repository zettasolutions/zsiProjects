

CREATE PROCEDURE [dbo].[vehicles_sel]
(
    @user_id INT = NULL
   ,@tab_id int = 1
   ,@search_val nvarchar(100)=null
   ,@is_active VARCHAR(1)='Y'
)
AS
BEGIN

	SET NOCOUNT ON
	DECLARE @curDate DATE
	DECLARE @endDate NVARCHAR(10) 
	DECLARE @startDate NVARCHAR(10) 
	DECLARE @stmt NVARCHAR(MAX)

IF @tab_id < 5
BEGIN
 	SET @curDate = DATEADD(HOUR,8,GETUTCDATE())
	SET @startDate = CONVERT(VARCHAR(10),@curDate,101)
		SET @stmt = 'SELECT * FROM vehicles WHERE is_active='''+ @is_active + '''';

	IF @tab_id = 2
    BEGIN
		SET @endDate = DATEADD(DAY,15,@curDate)
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),exp_registration_date,101) BETWEEN ''' + @startDate + ''' AND ''' + @endDate + '''';
	END

	IF @tab_id = 3
    BEGIN
		SET @endDate = CONVERT(VARCHAR(10),DATEADD(DAY,30,@curDate),101)
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(10),exp_registration_date,101) BETWEEN ''' + @startDate + ''' AND ''' + @endDate + '''';
	END
 
	IF @tab_id = 4
	BEGIN
		SET @stmt = @stmt + ' AND CONVERT(VARCHAR(26),exp_registration_date,121) <= ''' + CONVERT(VARCHAR(26),DATEADD(HOUR,8,GETUTCDATE()),101) + '''';
	END

	IF ISNULL(@search_val,'')<>''
       SET @stmt = @stmt + ' AND plate_no like ''%' + @search_val  + '%'' or conduction_no like ''%' + @search_val  + '%'' or chassis_no like ''%' + @search_val  + '%'' or engine_no like ''%' + @search_val  + '%'''

 END

 PRINT(@stmt);
 EXEC(@stmt);


 END;


 --[dbo].[vehicles_sel] @user_id=2, @tab_id=4