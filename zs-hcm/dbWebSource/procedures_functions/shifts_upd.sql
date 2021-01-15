CREATE PROCEDURE [dbo].[shifts_upd]
(
    @tt    shifts_tt READONLY
   ,@user_id int
)
AS
BEGIN
    DECLARE @client_id int
	DECLARE @stmt		VARCHAR(4000);
	SELECT @client_id=company_id FROM dbo.users_v WHERE user_id = @user_id;
	
	CREATE TABLE #tbl_shifts (
	[shift_id] [int] NULL,
	[is_edited] [char](1) NULL,
	[shift_code] [nvarchar](5) NULL,
	[shift_title] [nvarchar](10) NULL,
	[monday] [char](1) NULL,
	[tuesday] [char](1) NULL,
	[wednesday] [char](1) NULL,
	[thursday] [char](1) NULL,
	[friday] [char](1) NULL,
	[saturday] [char](1) NULL,
	[sunday] [char](1) NULL,
	[no_hours] [decimal](18, 2) NULL,
	[from_time_in] [time](7) NULL,
	[to_time_in] [time](7) NULL
)
   INSERT INTO #tbl_shifts SELECT * FROM @tt
-- Update Process
   SET @stmt= CONCAT('UPDATE a SET 
	   	      shift_code				= b.shift_code
			 ,shift_title				= b.shift_title
			 ,monday					= b.monday				
			 ,tuesday					= b.tuesday			
			 ,wednesday					= b.wednesday	
	 		 ,thursday					= b.thursday			
			 ,friday					= b.friday				
			 ,saturday					= b.saturday				
			 ,sunday					= b.sunday
			 ,no_hours					= b.no_hours			 
			 ,from_time_in				= b.from_time_in
			 ,to_time_in				= b.to_time_in	   	     
       FROM dbo.shifts_',@client_id,' a INNER JOIN #tbl_shifts b
	     ON a.shift_id = b.shift_id
	     WHERE ISNULL(b.is_edited,''N'')=''Y''') 
	PRINT(@stmt);
    EXEC(@stmt);
-- Insert Process

   SET @stmt = CONCAT('INSERT INTO dbo.shifts_',@client_id,'(
         shift_code	
		,shift_title
		,monday				
		,tuesday		
		,wednesday		
		,thursday			
		,friday	
		,saturday
		,sunday		
		,no_hours					
		,from_time_in	
		,to_time_in	
	)
	SELECT 
		 shift_code	
		,shift_title
		,monday					
		,tuesday		
		,wednesday		
		,thursday			
		,friday
		,saturday
		,sunday			
		,no_hours		
		,from_time_in	
		,to_time_in	
	FROM #tbl_shifts 
    WHERE shift_id IS NULL
    AND shift_code IS NOT NULL')
	PRINT(@stmt);
	EXEC(@stmt);
END;
