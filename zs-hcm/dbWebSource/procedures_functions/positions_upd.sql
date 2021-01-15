

CREATE PROCEDURE [dbo].[positions_upd]
(
    @tt    positions_tt READONLY
   ,@user_id int
)
AS
-- Update Process
BEGIN
DECLARE @stmt NVARCHAR(MAX)
DECLARE @client_id INT
SELECT @client_id = company_id FROM dbo.users_v where user_id =@user_id;
CREATE TABLE #pos (
	[position_id] [int] NULL,
	[is_edited] [char](1) NULL,
	[position_title] [nvarchar](50) NULL,
	[position_desc] [varchar](200) NULL,
	[work_desc] [varchar](max) NULL,
	[level_no] [int] NULL,
	[basic_pay] [decimal](18, 2) NULL,
	[hourly_rate] [decimal](18, 2) NULL,
	[daily_rate] [decimal](18, 2) NULL
)
INSERT INTO #pos SELECT * FROM @tt;
SET @stmt=CONCAT('UPDATE a 
		   SET 
	   	      position_title	= b.position_title
			 ,position_desc		= b.position_desc	   
			 ,work_desc         = b.work_desc
			 ,level_no          = b.level_no
			 ,basic_pay			= b.basic_pay	   
			 ,hourly_rate		= b.hourly_rate  
			 ,daily_rate        = b.daily_rate
			 ,updated_by        = ',@user_id,'
			 ,updated_date      = DATEADD(HOUR,8,GETUTCDATE())
       FROM dbo.positions_',@client_id,' a INNER JOIN #pos b
	     ON a.position_id = b.position_id 
	    AND (isnull(is_edited,''N'')=''Y'')')
EXEC(@stmt);

-- Insert Process
SET @stmt=CONCAT('INSERT INTO positions_',@client_id,' (
         position_title
		,position_desc	
		,work_desc
		,level_no
		,created_by
		,created_date
		,basic_pay	
		,hourly_rate
		,daily_rate 
    )
	SELECT 
		 position_title
		,position_desc	
		,work_desc
		,level_no,'
		,@user_id,'
		,DATEADD(HOUR,8,GETUTCDATE())	
		,basic_pay	
		,hourly_rate
		,daily_rate 
	FROM #pos
	WHERE position_id IS NULL
      AND position_title IS NOT NULL');
EXEC(@stmt);
DROP TABLE #pos
END;





