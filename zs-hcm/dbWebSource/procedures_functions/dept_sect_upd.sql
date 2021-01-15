CREATE PROCEDURE [dbo].[dept_sect_upd]
(
    @tt    dept_sect_tt READONLY
   ,@user_id int
)
AS
BEGIN
-- Update Process
    DECLARE @client_id int;
	DECLARE @stmt NVARCHAR(MAX)
	CREATE TABLE #dept(
	[dept_sect_id] [int] NULL,
	[dept_sect_parent_id] [int] NULL,
	[is_edited] [char](1) NULL,
	[dept_sect_code] [nvarchar](20) NULL,
	[dept_sect_name] [varchar](50) NULL,
	[is_active] [char](1) NULL)

    SELECT @client_id = company_id FROM dbo.users_v WHERE user_id=@user_id;
	INSERT INTO #dept SELECT * FROM @tt;
	SET @stmt = CONCAT('UPDATE a 
		         SET 
	   	       dept_sect_code		= b.dept_sect_code		
			  ,dept_sect_name		= b.dept_sect_name		
			  ,dept_sect_parent_id	= b.dept_sect_parent_id	
			  ,is_active			= b.is_active
			  ,updated_by			= ',@user_id,'
			  ,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())				
       FROM dbo.dept_sect_',@client_id,' a INNER JOIN #dept b
	     ON a.dept_sect_id = b.dept_sect_id 
	   WHERE ISNULL(b.is_edited,''N'')=''Y''') 
			PRINT(@stmt);
   EXEC(@stmt);
-- Insert Process
   SET @stmt = CONCAT('INSERT INTO dept_sect_',@client_id,' (
         dept_sect_code		
		,dept_sect_name			
		,dept_sect_parent_id	
		,is_active				
		,created_by
		,created_date
    )
	SELECT 
         dept_sect_code		
		,dept_sect_name		
		,dept_sect_parent_id
		,is_active			
		,',@user_id,'
		,DATEADD(HOUR, 8, GETUTCDATE())
	FROM #dept
	WHERE  dept_sect_id IS NULL
	  AND dept_sect_code IS NOT NULL
	  AND dept_sect_name IS NOT NULL')

PRINT(@stmt);
EXEC(@stmt);
DROP TABLE #dept;
END;



