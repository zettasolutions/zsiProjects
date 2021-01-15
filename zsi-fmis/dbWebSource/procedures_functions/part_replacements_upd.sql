
CREATE PROCEDURE [dbo].[part_replacements_upd]
(
    @tt    part_replacements_tt READONLY
   ,@user_id int
)
AS
   SET NOCOUNT ON
   DECLARE @client_id  INT;
   DECLARE @stmt NVARCHAR(MAX)
   SELECT @client_id=company_id FROM dbo.users_v where user_id = @user_id;

   CREATE TABLE #replacements (
	[replacement_id] [int] NULL,
	[is_edited] [char](1) NULL,
	[pms_id] [int] NULL,
	[repair_id] [int] NULL,
	[seq_no] [int] NULL,
	[part_id] [int] NULL,
	[part_qty] [decimal](8, 2) NULL,
	[unit_id] [int] NULL,
	[unit_cost] [decimal](8, 2) NULL,
	[is_replacement] [char](1) NULL,
	[is_bnew] [char](1) NULL)

	INSERT INTO #replacements SELECT * FROM @tt;

-- Update Process
	SET @stmt = CONCAT('UPDATE a 
		   SET 
		     seq_no                 = b.seq_no
			,part_id				= b.part_id
			,part_qty				= b.part_qty
			,unit_id				= b.unit_id	
			,unit_cost              = b.unit_cost
			,is_replacement         = b.is_replacement
			,is_bnew                = b.is_bnew
			,updated_by				= ',@user_id,'
			,updated_date			= DATEADD(HOUR, 8, GETUTCDATE())
        FROM dbo.part_replacements_',@client_id,' a INNER JOIN #replacements b
	     ON a.replacement_id = b.replacement_id 
		WHERE ISNULL(b.part_id,0) <> 0
	      AND isnull(b.is_edited,''N'')=''Y''')
	EXEC(@stmt);

-- Insert Process
	SET @stmt = CONCAT('INSERT INTO part_replacements_',@client_id,' (
			 pms_id 
			,repair_id
			,seq_no
			,part_id
			,part_qty
			,unit_id
			,unit_cost
			,is_replacement
			,is_bnew
			,created_by
			,created_date
			)
		 SELECT 
			 pms_id 
			,repair_id
			,seq_no
			,part_id
			,part_qty
			,unit_id
			,unit_cost
			,is_replacement
			,is_bnew
			,',@user_id,'
			,DATEADD(HOUR, 8, GETUTCDATE())
		FROM #replacements 
		WHERE replacement_id IS NULL
		AND part_id IS NOT NULL
		AND part_qty IS NOT NULL')

	EXEC(@stmt);
 
 



